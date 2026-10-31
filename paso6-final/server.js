// server.js: TU servidor. Aquí vive la API del concurso de disfraces.
// PASO 6 = versión final: API + seguridad + base de datos + fotos + votos.
// Funciona en tu computadora (npm run dev) y en Vercel (más abajo se exporta "app").

require("dotenv").config({ path: require("path").join(__dirname, ".env"), quiet: true }); // PASO 3: lee las claves del archivo .env
const crypto = require("crypto");
const path = require("path");
const express = require("express");
const helmet = require("helmet"); // PASO 3
const cors = require("cors"); // PASO 3
const rateLimit = require("express-rate-limit"); // PASO 3
const multer = require("multer"); // PASO 5

const app = express();
app.set("trust proxy", 1); // detrás de Vercel, para que el límite cuente a cada persona

// Las claves viven en el servidor (archivo .env o variables de Vercel), nunca en la página.
const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/$/, ""); // PASO 4
const SUPABASE_KEY = process.env.SUPABASE_KEY || ""; // PASO 4
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";

// ---------------------------------------------------------------
// PASO 3: SEGURIDAD (el portero)
// ---------------------------------------------------------------
// helmet pone cabeceras de seguridad. Solo dejamos cargar scripts de nuestro servidor
// y el del código QR, e imágenes de nuestro servidor y de nuestro Storage.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "https://cdnjs.cloudflare.com"],
        "img-src": ["'self'", "data:", "blob:", SUPABASE_URL].filter(Boolean),
        "upgrade-insecure-requests": null,
      },
    },
  })
);

// cors decide qué OTRAS páginas pueden usar tu API. Por defecto: ninguna.
app.use("/api", cors({ origin: process.env.ORIGEN_PERMITIDO || false }));

// Límite de peticiones: frena a quien intente abusar.
app.use("/api", rateLimit({ windowMs: 60 * 1000, limit: 120, message: { error: "Vas muy rápido. Espera un momento y vuelve a intentarlo" } }));
const limiteEscritura = rateLimit({ windowMs: 60 * 1000, limit: 20, message: { error: "Vas muy rápido. Espera un momento y vuelve a intentarlo" } });

// Solo aceptamos mensajes JSON pequeños.
app.use(express.json({ limit: "10kb" }));

// Valida lo que llega (nunca confíes en el cliente).
function validar(cuerpo) {
  const nombre = typeof cuerpo.nombre === "string" ? cuerpo.nombre.trim() : "";
  const disfraz = typeof cuerpo.disfraz === "string" ? cuerpo.disfraz.trim() : "";
  if (nombre.length < 2 || nombre.length > 30) return { error: "El nombre debe tener entre 2 y 30 letras" };
  if (disfraz.length < 2 || disfraz.length > 30) return { error: "El disfraz debe tener entre 2 y 30 letras" };
  return { nombre, disfraz };
}

// Errores que SÍ podemos mostrar a la persona (los demás se esconden).
function errorPublico(mensaje, estado = 400) {
  const e = new Error(mensaje);
  e.publico = true;
  e.estado = estado;
  return e;
}

// En Express 4, los errores de funciones async hay que mandarlos a next().
const asinc = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// ---------------------------------------------------------------
// PASO 4: BASE DE DATOS (hablamos con Supabase desde el servidor)
// ---------------------------------------------------------------
async function supabase(ruta, { metodo = "GET", cuerpo, cabeceras = {} } = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw errorPublico("Falta configurar SUPABASE_URL y SUPABASE_KEY", 503);
  return fetch(SUPABASE_URL + ruta, {
    method: metodo,
    headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY, ...cabeceras },
    body: cuerpo,
  });
}

async function fallo(r, que) {
  return new Error(que + ": Supabase respondió " + r.status + " " + (await r.text()));
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

async function listar() {
  const r = await supabase("/rest/v1/participantes?select=*&order=creado_en.desc");
  if (!r.ok) throw await fallo(r, "listar");
  return r.json();
}

async function obtener(id) {
  if (!UUID.test(id)) return null;
  const r = await supabase("/rest/v1/participantes?select=*&id=eq." + id);
  if (!r.ok) throw await fallo(r, "obtener");
  return (await r.json())[0] || null;
}

async function crear({ nombre, disfraz, foto_url }) {
  const r = await supabase("/rest/v1/participantes", {
    metodo: "POST",
    cabeceras: { "Content-Type": "application/json", Prefer: "return=representation" },
    cuerpo: JSON.stringify({ nombre, disfraz, foto_url }),
  });
  if (!r.ok) throw await fallo(r, "crear");
  return (await r.json())[0];
}

// ---------------------------------------------------------------
// PASO 1 y 2: LA API (el mesero)
// ---------------------------------------------------------------
// GET = ver el menú
app.get("/api/participantes", asinc(async (req, res) => {
  res.json(await listar());
}));

// GET de uno solo. Si no existe: 404 ("no está en el menú")
app.get("/api/participantes/:id", asinc(async (req, res) => {
  const p = await obtener(req.params.id);
  if (!p) return res.status(404).json({ error: "Ese participante no existe" });
  res.json(p);
}));

// ---------------------------------------------------------------
// PASO 5: ARCHIVOS (el paquete por correo)
// ---------------------------------------------------------------
// Solo aceptamos estos tipos, y el nombre lo ponemos NOSOTROS (nunca el del usuario).
const TIPOS = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };

const subida = multer({
  storage: multer.memoryStorage(), // la foto pasa por la memoria; el disco de Vercel no sirve para guardar
  limits: { fileSize: 2 * 1024 * 1024, files: 1 }, // máximo 2 MB
  fileFilter: (req, archivo, cb) => {
    if (TIPOS[archivo.mimetype]) return cb(null, true);
    cb(errorPublico("Solo se aceptan fotos jpg, png o webp"));
  },
});

// El tipo que dice el archivo se puede falsificar: miramos sus primeros bytes.
function esImagenReal(b) {
  const jpg = b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  const png = b[0] === 0x89 && b.toString("latin1", 1, 4) === "PNG";
  const webp = b.toString("latin1", 0, 4) === "RIFF" && b.toString("latin1", 8, 12) === "WEBP";
  return jpg || png || webp;
}

// Subir la foto al Storage de Supabase y devolver su dirección pública.
app.post("/api/fotos", limiteEscritura, subida.single("foto"), asinc(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Falta la foto" });
  if (!esImagenReal(req.file.buffer)) return res.status(400).json({ error: "El archivo no es una imagen real" });
  const nombre = crypto.randomUUID() + TIPOS[req.file.mimetype];
  const r = await supabase("/storage/v1/object/disfraces/" + nombre, {
    metodo: "POST",
    cabeceras: { "Content-Type": req.file.mimetype },
    cuerpo: req.file.buffer,
  });
  if (!r.ok) throw await fallo(r, "subir foto");
  res.status(201).json({ url: SUPABASE_URL + "/storage/v1/object/public/disfraces/" + nombre });
}));

// Solo aceptamos fotos que salieron de NUESTRO Storage (no direcciones inventadas).
const PREFIJO_FOTOS = SUPABASE_URL + "/storage/v1/object/public/disfraces/";
function fotoValida(url) {
  return typeof url === "string" && url.startsWith(PREFIJO_FOTOS) && /^[0-9a-f-]{36}\.(jpg|png|webp)$/.test(url.slice(PREFIJO_FOTOS.length));
}

// POST = hacer un pedido nuevo. Si lo pidieron mal: 400. Si salió bien: 201.
app.post("/api/participantes", limiteEscritura, asinc(async (req, res) => {
  const datos = validar(req.body || {});
  if (datos.error) return res.status(400).json({ error: datos.error });
  const foto = req.body.foto_url || null;
  if (foto && !fotoValida(foto)) return res.status(400).json({ error: "La foto no es válida" });
  res.status(201).json(await crear({ nombre: datos.nombre, disfraz: datos.disfraz, foto_url: foto }));
}));

// ---------------------------------------------------------------
// PASO 6: VOTOS Y RANKING
// ---------------------------------------------------------------
app.post("/api/participantes/:id/votar", limiteEscritura, asinc(async (req, res) => {
  const dispositivo = req.get("x-dispositivo") || "";
  if (dispositivo.length < 8 || dispositivo.length > 64) return res.status(400).json({ error: "Dispositivo no válido" });
  if (!UUID.test(req.params.id)) return res.status(404).json({ error: "Ese participante no existe" });
  // La regla de "un solo voto por dispositivo" la hace la base de datos (función votar).
  const r = await supabase("/rest/v1/rpc/votar", {
    metodo: "POST",
    cabeceras: { "Content-Type": "application/json" },
    cuerpo: JSON.stringify({ p_id: req.params.id, p_dispositivo: dispositivo }),
  });
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    if (e.message === "Ya votaste") throw errorPublico("Ya votaste", 409);
    if (e.message === "Ese disfraz no existe") throw errorPublico("Ese participante no existe", 404);
    throw new Error("votar: Supabase respondió " + r.status + " " + JSON.stringify(e));
  }
  res.json(await obtener(req.params.id));
}));

app.get("/api/ranking", asinc(async (req, res) => {
  res.json((await listar()).sort((a, b) => b.votos - a.votos).slice(0, 5));
}));

// ---------------------------------------------------------------
// PASO 3: RUTA DE ADMIN protegida con un token secreto (.env)
// ---------------------------------------------------------------
app.get("/api/admin/resumen", asinc(async (req, res) => {
  if (!ADMIN_TOKEN) return res.status(503).json({ error: "La ruta de admin está apagada (falta ADMIN_TOKEN)" });
  if (req.get("x-admin-token") !== ADMIN_TOKEN) return res.status(401).json({ error: "No autorizado" });
  const lista = await listar();
  res.json({ participantes: lista.length, conFoto: lista.filter((p) => p.foto_url).length, votos: lista.reduce((s, p) => s + p.votos, 0) });
}));

// Para comprobar que el servidor está vivo
app.get("/salud", (req, res) => res.json({ ok: true }));

// ---------------------------------------------------------------
// La página (index.html y proyector.html) vive en la carpeta public
// ---------------------------------------------------------------
app.use(express.static(path.join(__dirname, "public")));

// PASO 3: rutas que no existen y errores, sin soltar detalles internos
app.use("/api", (req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") return res.status(413).json({ error: "La foto pesa más de 2 MB" });
  if (err.type === "entity.too.large") return res.status(413).json({ error: "El mensaje es demasiado grande" });
  if (err.type === "entity.parse.failed") return res.status(400).json({ error: "El JSON no es válido" });
  if (err.publico) return res.status(err.estado || 400).json({ error: err.message });
  console.error(err); // el detalle solo lo vemos nosotros, en los registros del servidor
  res.status(500).json({ error: "Algo salió mal en el servidor" });
});

// En tu computadora: arranca el servidor. En Vercel: solo exporta la app.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log("Servidor listo en http://localhost:" + PORT));
}
module.exports = app;

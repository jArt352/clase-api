// server.js: TU servidor. Aquí vive la API del concurso de disfraces.
// PASO 3 = API + seguridad (los datos siguen en memoria; la base de datos real es el paso 4).

require("dotenv").config({ path: require("path").join(__dirname, ".env"), quiet: true }); // PASO 3: lee las claves del archivo .env
const crypto = require("crypto");
const path = require("path");
const express = require("express");
const helmet = require("helmet"); // PASO 3
const cors = require("cors"); // PASO 3
const rateLimit = require("express-rate-limit"); // PASO 3

const app = express();
const PORT = process.env.PORT || 3000;
app.set("trust proxy", 1); // detrás de Vercel, para que el límite cuente a cada persona

// ---------------------------------------------------------------
// PASO 3: SEGURIDAD (el portero)
// ---------------------------------------------------------------
// helmet pone cabeceras de seguridad. Aquí solo dejamos cargar scripts de nuestro servidor
// y el del código QR.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "https://cdnjs.cloudflare.com"],
        "img-src": ["'self'", "data:", "blob:"],
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

// ---------------------------------------------------------------
// La "libreta" de participantes (por ahora vive en la memoria)
// ---------------------------------------------------------------
const ahora = Date.now();
let participantes = [
  { id: "1", nombre: "Ana", disfraz: "Fantasma", foto_url: null, votos: 0, creado_en: ahora - 3000 },
  { id: "2", nombre: "Luis", disfraz: "Brujo", foto_url: null, votos: 0, creado_en: ahora - 2000 },
  { id: "3", nombre: "Marta", disfraz: "Vampiresa", foto_url: null, votos: 0, creado_en: ahora - 1000 },
];

// ---------------------------------------------------------------
// PASO 3: VALIDAR lo que llega (nunca confíes en el cliente)
// ---------------------------------------------------------------
function validar(cuerpo) {
  const nombre = typeof cuerpo.nombre === "string" ? cuerpo.nombre.trim() : "";
  const disfraz = typeof cuerpo.disfraz === "string" ? cuerpo.disfraz.trim() : "";
  if (nombre.length < 2 || nombre.length > 30) return { error: "El nombre debe tener entre 2 y 30 letras" };
  if (disfraz.length < 2 || disfraz.length > 30) return { error: "El disfraz debe tener entre 2 y 30 letras" };
  return { nombre, disfraz };
}

// ---------------------------------------------------------------
// PASO 1 y 2: LA API (el mesero)
// ---------------------------------------------------------------
// GET = ver el menú
app.get("/api/participantes", (req, res) => {
  res.json([...participantes].sort((a, b) => b.creado_en - a.creado_en));
});

// GET de uno solo. Si no existe: 404 ("no está en el menú")
app.get("/api/participantes/:id", (req, res) => {
  const p = participantes.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: "Ese participante no existe" });
  res.json(p);
});

// POST = hacer un pedido nuevo. Si lo pidieron mal: 400. Si salió bien: 201.
app.post("/api/participantes", limiteEscritura, (req, res) => {
  const datos = validar(req.body || {});
  if (datos.error) return res.status(400).json({ error: datos.error });
  const nuevo = { id: crypto.randomUUID(), nombre: datos.nombre, disfraz: datos.disfraz, foto_url: null, votos: 0, creado_en: Date.now() };
  participantes.push(nuevo);
  res.status(201).json(nuevo);
});

// ---------------------------------------------------------------
// PASO 3: RUTA DE ADMIN protegida con un token secreto (.env)
// ---------------------------------------------------------------
app.get("/api/admin/resumen", (req, res) => {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return res.status(503).json({ error: "La ruta de admin está apagada (falta ADMIN_TOKEN)" });
  if (req.get("x-admin-token") !== token) return res.status(401).json({ error: "No autorizado" });
  res.json({ participantes: participantes.length, conFoto: participantes.filter((p) => p.foto_url).length });
});

// Para comprobar que el servidor está vivo
app.get("/salud", (req, res) => res.json({ ok: true }));

// ---------------------------------------------------------------
// La página (index.html y proyector.html) vive en la carpeta public
// ---------------------------------------------------------------
app.use(express.static(path.join(__dirname, "public")));

// PASO 3: rutas que no existen y errores, sin soltar detalles internos
app.use("/api", (req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") return res.status(413).json({ error: "El mensaje es demasiado grande" });
  if (err.type === "entity.parse.failed") return res.status(400).json({ error: "El JSON no es válido" });
  console.error(err);
  res.status(500).json({ error: "Algo salió mal en el servidor" });
});

app.listen(PORT, () => console.log("Servidor listo en http://localhost:" + PORT));

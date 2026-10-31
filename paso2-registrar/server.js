// server.js: TU servidor. Aquí vive la API del concurso de disfraces.
// PASO 2 = ver participantes (GET) y registrar uno nuevo (POST).

const crypto = require("crypto");
const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Permite leer mensajes JSON que llegan en el cuerpo de la petición (PASO 2)
app.use(express.json());

// La "libreta" de participantes (por ahora vive en la memoria)
const ahora = Date.now();
const participantes = [
  { id: "1", nombre: "Ana", disfraz: "Fantasma", foto_url: null, votos: 0, creado_en: ahora - 3000 },
  { id: "2", nombre: "Luis", disfraz: "Brujo", foto_url: null, votos: 0, creado_en: ahora - 2000 },
  { id: "3", nombre: "Marta", disfraz: "Vampiresa", foto_url: null, votos: 0, creado_en: ahora - 1000 },
];

// GET = ver el menú
app.get("/api/participantes", (req, res) => {
  res.json([...participantes].sort((a, b) => b.creado_en - a.creado_en));
});

// PASO 2: GET de uno solo. Si no existe: 404 ("no está en el menú")
app.get("/api/participantes/:id", (req, res) => {
  const p = participantes.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: "Ese participante no existe" });
  res.json(p);
});

// PASO 2: POST = hacer un pedido nuevo. Si lo pidieron mal: 400. Si salió bien: 201.
app.post("/api/participantes", (req, res) => {
  const { nombre, disfraz } = req.body;
  if (!nombre || !disfraz) return res.status(400).json({ error: "Faltan el nombre o el disfraz" });
  const nuevo = { id: crypto.randomUUID(), nombre, disfraz, foto_url: null, votos: 0, creado_en: Date.now() };
  participantes.push(nuevo);
  res.status(201).json(nuevo);
});

// La página (index.html y proyector.html) vive en la carpeta public
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log("Servidor listo en http://localhost:" + PORT));

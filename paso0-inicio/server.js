// server.js: TU servidor. Empieza casi vacío: la IA lo va a ir completando contigo.
// Hoy solo tiene lo mínimo: un servidor que muestra la página y una lista de participantes.

const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// La "libreta" de participantes (por ahora vive en la memoria)
const ahora = Date.now();
const participantes = [
  { id: "1", nombre: "Ana", disfraz: "Fantasma", foto_url: null, votos: 0, creado_en: ahora - 3000 },
  { id: "2", nombre: "Luis", disfraz: "Brujo", foto_url: null, votos: 0, creado_en: ahora - 2000 },
  { id: "3", nombre: "Marta", disfraz: "Vampiresa", foto_url: null, votos: 0, creado_en: ahora - 1000 },
];

// La página (index.html y proyector.html) vive en la carpeta public
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log("Servidor listo en http://localhost:" + PORT));

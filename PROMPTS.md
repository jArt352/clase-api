# Guía de prompts: construye tu API con tu IA

No necesitas saber programar. Tú diriges, la IA escribe el código y tú compruebas que funcione.

## Cómo se usa (3 movimientos)

1. **Pega el prompt del paso** en tu IA (ChatGPT, Claude, Gemini, Copilot, Cursor...).
2. **Copia el `server.js` que te devuelve** y pégalo en tu archivo `server.js` (reemplaza todo). Guarda.
3. **Prueba** lo que dice "Debes ver". Si funciona, pasas al siguiente paso.

Dos formas de trabajar, elige la tuya:

| Si usas... | Haz esto |
|---|---|
| **Un chat de IA** (ChatGPT, Claude, Gemini) | Pega el Prompt 0 una vez. En cada paso pega el prompt **y tu `server.js` actual** al final. |
| **IA dentro de tu editor** (Cursor, Copilot, Claude Code...) | Abre la carpeta, pega el Prompt 0 y luego el prompt del paso. La IA ve tus archivos. |

## Reglas de oro

- **Un prompt por paso.** No mezcles pasos.
- Si algo falla, usa el **prompt de rescate** (al final). Si falla dos veces, **copia el `server.js` de la carpeta del paso** y sigue con el grupo.
- **Nunca pegues claves secretas ni tu archivo `.env` en la IA.**
- Reemplaza lo que va entre `<...>` por tus datos antes de enviar.

## Antes de empezar

1. Abre la carpeta `paso0-inicio` en VS Code.
2. En la terminal: `npm install` y luego `npm run dev`.
3. Abre http://localhost:3000. La página se ve, pero dice que le faltan rutas. Eso es lo que vamos a arreglar.

---

## Prompt 0: el contexto (pégalo UNA vez al inicio)

```
Estoy construyendo, con tu ayuda, el servidor de un "Concurso de disfraces" con Node.js y Express 4 (CommonJS, usando require; sin TypeScript ni módulos ES). Soy principiante: explícame todo con palabras simples y analogías (la API es un mesero, la seguridad es un portero, los archivos son un paquete por correo).

La página ya está lista en la carpeta public/ y NO debes cambiarla. Solo programamos server.js.

La página espera exactamente esta API:
- GET /api/participantes → lista JSON de participantes, los más nuevos primero.
- POST /api/participantes → recibe JSON { nombre, disfraz, foto_url } y responde 201 con el participante creado.
- POST /api/fotos → recibe un archivo en el campo "foto" y responde 201 con { "url": "..." }.
- POST /api/participantes/:id/votar → usa el header x-dispositivo y responde 200 con el participante actualizado.

Cada participante tiene: { id, nombre, disfraz, foto_url, votos, creado_en }.
Los errores se responden siempre como JSON { "error": "mensaje en español" } con el código HTTP correcto (400, 404, 409, 413, 429 o 500).

Reglas: dame siempre el server.js COMPLETO listo para copiar y pegar, dime qué comandos npm debo correr y explícame en pocas frases qué hizo el código.

Responde solo "Entendido" y espera mi siguiente mensaje.
```

---

## Paso 1: ver los participantes (GET)

```
Paso 1: agrega a mi server.js la ruta GET /api/participantes que responda la lista "participantes" en formato JSON, con los más nuevos primero (ordena por creado_en de mayor a menor). Dame el server.js completo y explícame en 3 frases qué hace la ruta.
```

(Si usas un chat, pega al final tu `server.js` actual.)

**Debes ver:**
- http://localhost:3000/api/participantes muestra 3 participantes en JSON.
- http://localhost:3000 muestra las tarjetas de Ana, Luis y Marta.

---

## Paso 2: registrar un participante (POST)

```
Paso 2: agrega POST /api/participantes. Debe leer JSON (express.json()), exigir "nombre" y "disfraz" (si falta alguno, responder 400 con { "error": "Faltan el nombre o el disfraz" }), crear el participante con id = crypto.randomUUID(), foto_url = null, votos = 0 y creado_en = Date.now(), guardarlo en la lista y responder 201 con el participante.
Agrega también GET /api/participantes/:id que responda 404 con { "error": "Ese participante no existe" } si no existe.
Dame el server.js completo.
```

**Debes ver:**
- En la página, escribes tu nombre y disfraz, pulsas **Enviar al muro** y aparece tu tarjeta.
- Con Thunder Client: `POST /api/participantes` sin disfraz responde **400**; `GET /api/participantes/inventado` responde **404**.

---

## Paso 3: seguridad (el portero)

Primero ataca tu propia página: registra un nombre vacío, uno de 5000 letras y uno con `<script>alert(1)</script>`. Mira qué pasa. Luego:

```
Paso 3: hazlo más seguro, y dime qué comandos npm debo correr. Quiero:
1) Validar: nombre y disfraz deben ser texto de 2 a 30 caracteres (sin contar espacios de los lados). Si no, 400 con un mensaje claro en { "error": ... }.
2) express.json({ limit: "10kb" }); si el mensaje es muy grande, 413 con { "error": "El mensaje es demasiado grande" }.
3) helmet con esta política: script-src solo 'self' y https://cdnjs.cloudflare.com; img-src 'self' data: blob:; y upgrade-insecure-requests desactivado.
4) cors solo si existe la variable de entorno ORIGEN_PERMITIDO (por defecto, sin permiso para otras páginas).
5) express-rate-limit: 120 peticiones por minuto en /api y 20 por minuto en las rutas POST, con el mensaje JSON { "error": "Vas muy rápido. Espera un momento y vuelve a intentarlo" }.
6) app.set("trust proxy", 1).
7) Cualquier ruta /api que no exista responde 404 con { "error": "Ruta no encontrada" }, y un manejador de errores final que NO muestre detalles internos (500 con { "error": "Algo salió mal en el servidor" }).
Dame el server.js completo y explica qué protege cada cosa con la analogía del portero.
```

**Debes ver:**
- Nombre vacío o de 1 letra: la página muestra un error claro.
- 25 envíos seguidos: aparece "Vas muy rápido" (error 429).
- La página sigue funcionando sin errores en la consola.

### Juego "Cazafantasmas de bugs"

En parejas, intenten romper la API del compañero (nombres raros, envíos repetidos). Gana quien encuentre más fallos.

### Pídele a la IA que te audite

```
Actúa como experto en seguridad. Revisa mi server.js y dime los 5 riesgos más importantes en lenguaje simple: qué podría hacer un atacante y cómo se arregla. No cambies el código todavía.
```

---

## Paso 4: base de datos real (Supabase)

Hasta ahora los datos vivían en la memoria y se perdían al reiniciar. Pide al profesor `SUPABASE_URL` y `SUPABASE_KEY`.

1. Crea un archivo `.env` en tu carpeta con:

```
SUPABASE_URL=<la URL que te da el profesor>
SUPABASE_KEY=<la clave "publishable" que te da el profesor>
```

2. Pega este prompt:

```
Paso 4: ahora los participantes deben guardarse en Supabase, no en la memoria. Usa fetch (Node 20) contra su API REST.
- Variables de entorno desde el archivo .env con dotenv (carga la ruta con path.join(__dirname, ".env") y quiet: true): SUPABASE_URL y SUPABASE_KEY. Si faltan, responde 503 con { "error": "Falta configurar SUPABASE_URL y SUPABASE_KEY" }.
- En cada petición a Supabase manda los headers: apikey: SUPABASE_KEY y Authorization: Bearer SUPABASE_KEY.
- Tabla "participantes" (columnas: id uuid, nombre, disfraz, foto_url, votos, creado_en).
- Listar: GET {SUPABASE_URL}/rest/v1/participantes?select=*&order=creado_en.desc
- Crear: POST {SUPABASE_URL}/rest/v1/participantes con JSON { nombre, disfraz, foto_url } y el header Prefer: return=representation (devuelve un arreglo; responde el primer elemento con 201).
- Obtener uno: GET {SUPABASE_URL}/rest/v1/participantes?select=*&id=eq.<id>. Antes valida que el id sea un UUID; si no existe, 404.
- Quita la lista en memoria.
- Express 4 no captura errores de funciones async: crea un envoltorio que los mande a next(). Si Supabase falla, registra el detalle con console.error y responde 500 genérico.
- En helmet agrega la URL de Supabase a img-src.
- Al final del archivo, solo arranca el servidor si require.main === module, y exporta la app con module.exports = app (así se podrá publicar en Vercel).
Dime qué debo instalar, dame el server.js completo y un archivo .env.example (sin claves reales).
```

**Debes ver:**
- Registras tu disfraz y aparece en tu página.
- Reinicias el servidor y **tu disfraz sigue ahí**.
- También aparece en el muro del profesor.

---

## Paso 5: archivos (la foto)

```
Paso 5: agrega la subida de fotos y dime qué debo instalar (multer).
1) POST /api/fotos recibe un archivo en el campo "foto" con multer.memoryStorage() (NO guardes en disco: en Vercel no sirve).
2) Límites: máximo 2 MB (si pasa, 413 con { "error": "La foto pesa más de 2 MB" }) y solo image/jpeg, image/png e image/webp (si no, 400 con { "error": "Solo se aceptan fotos jpg, png o webp" }).
3) No confíes en el tipo que declara el archivo: revisa sus primeros bytes (JPEG: FF D8 FF; PNG: 89 50 4E 47; WEBP: "RIFF" y "WEBP" en las posiciones 0 y 8). Si no coincide, 400 con { "error": "El archivo no es una imagen real" }.
4) Ponle un nombre nuevo: crypto.randomUUID() más la extensión según el tipo. Nunca uses el nombre original.
5) Súbela a Supabase Storage: POST {SUPABASE_URL}/storage/v1/object/disfraces/<nombre> con los headers apikey y Authorization: Bearer SUPABASE_KEY, el Content-Type del archivo y el contenido como body. Responde 201 con { "url": "{SUPABASE_URL}/storage/v1/object/public/disfraces/<nombre>" }.
6) En POST /api/participantes acepta un foto_url opcional, pero SOLO si empieza con "{SUPABASE_URL}/storage/v1/object/public/disfraces/" y termina en un UUID con .jpg, .png o .webp; si no, 400 con { "error": "La foto no es válida" }.
7) Los errores de multer deben salir como JSON en el manejador de errores.
Dame el server.js completo.
```

**Debes ver:**
- Subes una selfie desde la página y aparece en tu tarjeta.
- Un PDF o un `.exe` renombrado a `.jpg` se rechaza.

**Reto:** intenta subir un PDF, un `.exe` renombrado a `.jpg` y una foto de más de 2 MB.

---

## Paso 6: votar y ranking

```
Paso 6: agrega POST /api/participantes/:id/votar.
- Lee el header x-dispositivo (entre 8 y 64 caracteres; si no, 400 con { "error": "Dispositivo no válido" }).
- Valida que :id sea un UUID (si no, 404 con { "error": "Ese participante no existe" }).
- Llama a la función de Supabase "votar": POST {SUPABASE_URL}/rest/v1/rpc/votar con JSON { "p_id": id, "p_dispositivo": dispositivo } y los mismos headers.
- Si Supabase responde un error con message "Ya votaste" → 409 con { "error": "Ya votaste" }. Si el message es "Ese disfraz no existe" → 404 con { "error": "Ese participante no existe" }. Cualquier otro error → 500 genérico y registra el detalle con console.error.
- Si todo sale bien, responde 200 con el participante actualizado (vuelve a consultarlo).
- Agrega también GET /api/ranking con los 5 participantes con más votos.
Dame el server.js completo y explícame por qué la regla de "un voto por persona" vive en la base de datos y no en la página.
```

**Debes ver:**
- Votas una vez y el contador sube.
- El segundo intento dice "Ya votaste".

---

## Publicar en Vercel (gratis)

1. **Sube tu proyecto a GitHub, sin programar:** en github.com pulsa **New repository**, ponle un nombre y créalo. Luego elige **uploading an existing file** y arrastra estos archivos: `server.js`, `package.json`, `package-lock.json` y la carpeta `public`. **No subas la carpeta `node_modules` ni el archivo `.env`.** Pulsa **Commit changes**.
2. En vercel.com entra con GitHub, **Add New > Project** e importa tu repositorio.
3. Verifica que el preset sea **Express**. (Si ves varias aplicaciones, pulsa **"Import single project"** en la tuya.)
4. Abre **Environment Variables** y crea `SUPABASE_URL` y `SUPABASE_KEY` (los mismos valores de tu `.env`).
5. Pulsa **Deploy**. Si tienes verificación en dos pasos, Vercel te pedirá el código de tu app. Al terminar te da tu link `.vercel.app`.

Si algo falla, usa este prompt:

```
Voy a publicar mi proyecto en Vercel (plan gratis). Revisa mi server.js y mi package.json y dime, en pasos simples: si .env está en .gitignore, si server.js exporta la app con module.exports y solo hace listen cuando se ejecuta directamente, y qué variables de entorno debo crear en Vercel. Este es mi server.js: <pega aquí tu server.js>
```

---

## Prompts de rescate

**Me sale un error:**

```
Me sale este error: <pega aquí el error exacto>
Este es mi server.js actual: <pega aquí tu server.js>
Explícame en simple qué significa y dame el server.js completo corregido.
```

**No entiendo el código:**

```
Explícame este código como si tuviera 12 años, línea por línea, con la analogía del restaurante: <pega aquí el código>
```

**Quiero personalizar mi página:**

```
Cambia SOLO el archivo public/estilos.css para que el tema sea <por ejemplo: fiesta zombi con verde neón>. Dame el archivo completo.
```

---

## Si nada funciona

Copia el `server.js` de la carpeta del paso que estás haciendo (`paso1-leer`, `paso2-registrar`, ...) y pégalo en el tuyo. Sigues con el grupo y después pides a la IA que te lo explique.

# Guía del alumno: tu API del concurso de disfraces

Hoy construyes **tu propio servidor** (una API), lo proteges, le agregas fotos y lo publicas en internet.
Todos hacemos los mismos pasos, al mismo tiempo.

## Las 3 ideas de hoy

| Tema | Es como... | Qué haces |
|---|---|---|
| **API** | Un mesero: lleva tu pedido a la cocina y te trae la respuesta | Programas las rutas de tu servidor |
| **Seguridad** | Un portero: revisa quién entra y qué trae | Validas, limitas y proteges con claves |
| **Archivos** | Un paquete por correo: se revisa antes de guardarlo | Subes la foto del disfraz |

## Lo que necesitas (todo gratis)

- Node.js 20 o más (`node -v` en la terminal)
- VS Code y la extensión **Thunder Client**
- Una cuenta de **GitHub**
- Una cuenta de **Vercel** (se crea con "Continue with GitHub")
- Las claves de la base de datos: te las da el profesor

## Cómo trabajamos

1. Abre la carpeta `paso1-leer` en VS Code.
2. Instala y arranca:

```bash
npm install
npm run dev
```

3. Abre http://localhost:3000. Verás la página del concurso.
4. En cada paso, escribes lo que indica el profesor en `server.js`. Los bloques nuevos están marcados con `// PASO N`.
5. **Si te pierdes**, copia el `server.js` de la carpeta del paso siguiente y sigue con el grupo. Nadie se queda atrás.

> Cada vez que cambies `server.js`, el servidor se reinicia solo (`npm run dev`).

---

## Paso 1: tu primera ruta (GET)

**Idea:** `GET` es "ver el menú". Cuando alguien pide `/api/participantes`, el servidor responde la lista.

```js
app.get("/api/participantes", (req, res) => {
  res.json(participantes);
});
```

**Pruébalo:** abre http://localhost:3000/api/participantes. Debes ver 3 participantes en JSON.
Luego abre http://localhost:3000: la página muestra las tarjetas.

## Paso 2: registrar participantes (POST)

**Idea:** `POST` es "hacer un pedido nuevo". El servidor responde con un número que dice cómo salió:

| Número | Significa |
|---|---|
| 200 / 201 | Listo / creado |
| 400 | Pediste mal |
| 404 | No existe |
| 500 | Se quemó la cocina |

Agrega `app.use(express.json())` y la ruta `app.post("/api/participantes", ...)` (están en `paso2-registrar/server.js`).

**Pruébalo en Thunder Client:**
- `POST http://localhost:3000/api/participantes` con cuerpo JSON `{"nombre":"Ana","disfraz":"Bruja"}`: debe responder **201**.
- Lo mismo sin `disfraz`: debe responder **400**.
- `GET http://localhost:3000/api/participantes/inventado`: debe responder **404**.

En la página, registra tu disfraz: aparece una tarjeta nueva.

## Paso 3: seguridad (el portero)

**Primero atacamos.** Registra un participante con nombre vacío, con 5000 letras y con `<script>alert(1)</script>`. Mira qué pasa.

**Luego protegemos** (todo en `paso3-seguridad/server.js`):

| Defensa | Qué hace |
|---|---|
| `validar(...)` | Solo acepta nombre y disfraz de 2 a 30 letras |
| `express.json({ limit: "10kb" })` | Rechaza mensajes enormes (error 413) |
| `helmet` | Cabeceras de seguridad (no deja cargar scripts ajenos) |
| `cors` | Decide qué otras páginas pueden usar tu API (por defecto, ninguna) |
| `express-rate-limit` | Frena a quien manda demasiadas peticiones (error 429) |
| `.env` + `ADMIN_TOKEN` | Una clave secreta que no se sube a GitHub |

```bash
npm install helmet cors express-rate-limit dotenv
```

Crea un archivo `.env` (copia `.env.example`) con `ADMIN_TOKEN=una-clave-larga-que-inventes`.

**Pruébalo:**
- `GET /api/admin/resumen` sin clave: **401**. Con la cabecera `x-admin-token: tu-clave`: **200**.
- Manda 25 peticiones seguidas: aparece **429**.

> Regla de oro: **nunca confíes en lo que manda el cliente.**

## Paso 4: base de datos real

Hasta ahora los datos vivían en la memoria: al reiniciar el servidor, se perdían.
Ahora tu servidor guarda en **Supabase** (la base de datos del profesor).

Agrega a tu `.env` las dos claves que te da el profesor:

```
SUPABASE_URL=...
SUPABASE_KEY=...
```

Reemplaza la lista en memoria por las funciones `listar()`, `obtener()` y `crear()` de `paso4-base-de-datos/server.js`.

**Pruébalo:** registra tu disfraz. Aparece en tu página y también en el muro del profesor.

> `SUPABASE_KEY` es una clave "publishable": está hecha para ser pública, y es segura porque la base tiene reglas (RLS). **Nunca** uses una clave `secret` o `service_role` en el navegador.

## Paso 5: archivos (la foto)

```bash
npm install multer
```

**Idea:** un archivo viaja distinto a un texto (`multipart/form-data`). Antes de guardarlo lo revisamos:

| Revisión | Por qué |
|---|---|
| Máximo 2 MB | Evita que llenen el servidor |
| Solo jpg, png o webp | Evita archivos peligrosos |
| Mirar los primeros bytes | Un `.exe` renombrado a `.jpg` se descubre |
| Ponerle un nombre nuevo | Nunca confiamos en el nombre que mandan |

Agrega la ruta `POST /api/fotos` de `paso5-archivos/server.js`.

**Pruébalo:**
- Sube una selfie desde la página: aparece en tu tarjeta.
- Sube un PDF: debe rechazarlo.
- Sube una foto de más de 2 MB desde Thunder Client: **413**.

## Paso 6: votar y publicar

Agrega las rutas de votos (`paso6-final/server.js`). La regla de **un solo voto por dispositivo** la hace la base de datos.

### Publicar en Vercel

1. Sube tu carpeta a un repositorio nuevo de GitHub. **Comprueba que `.env` no se sube** (está en `.gitignore`).
2. Entra a vercel.com con GitHub y elige **Add New > Project**. Importa tu repositorio.
3. Antes de pulsar **Deploy**, abre **Environment Variables** y agrega:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `ADMIN_TOKEN` (inventa una clave nueva)
4. Pulsa **Deploy** y espera. Vercel te da un link público.
5. Abre `tu-link/` y `tu-link/proyector.html`.

> Si la página principal no abre, entra por `tu-link/index.html` y avisa al profesor.

## Lo que lograste hoy

- Programaste una **API** con rutas GET y POST.
- La **protegiste** (validación, límites, CORS, cabeceras y claves).
- Le agregaste **manejo de archivos** con revisión.
- La conectaste a una **base de datos** y la **publicaste en internet**.

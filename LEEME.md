# Clase: construye tu API con tu IA

Un servidor en Node + Express que los alumnos construyen **dirigiendo a una IA con prompts**, sin necesidad de programar. Cada carpeta es una versión que se puede ejecutar.

| Carpeta | Qué contiene | Tema |
|---|---|---|
| `paso0-inicio` | **Punto de partida**: servidor casi vacío | |
| `paso1-leer` | Ruta `GET /api/participantes` | API |
| `paso2-registrar` | `POST` y números de respuesta (201, 400, 404) | API |
| `paso3-seguridad` | Validación, `helmet`, `cors`, límite de peticiones | Seguridad |
| `paso4-base-de-datos` | Datos reales en Supabase | API + datos |
| `paso5-archivos` | Subida de foto con revisión | Archivos |
| `paso6-final` | Votos, ranking y listo para Vercel | Todo junto |

Los alumnos empiezan en `paso0-inicio`. Las demás carpetas son **la solución de cada paso**: si algo falla, copian el `server.js` del paso y siguen.

## Documentos

- [GUIA-ALUMNO.md](GUIA-ALUMNO.md) y [PROMPTS.md](PROMPTS.md) (los prompts listos para copiar).

## Probar en tu computadora

```bash
cd paso6-final
cp .env.example .env
npm install
npm run dev
```

Abre http://localhost:3000 (celular) y http://localhost:3000/proyector.html (pantalla grande).

## Requisito de Supabase

La base de datos necesita haber ejecutado `setup.sql` del proyecto `muro-disfraces` (tabla `participantes`, función `votar` y bucket `disfraces`).

## Publicar en Vercel

Importa el repositorio y define las variables `SUPABASE_URL`, `SUPABASE_KEY` y `ADMIN_TOKEN`. El servidor exporta `app` para que Vercel lo ejecute como función.

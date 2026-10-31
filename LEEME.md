# Clase: tu API del concurso de disfraces

Servidor en Node + Express, hecho paso a paso. Cada carpeta es una versión completa que se puede ejecutar.

| Carpeta | Qué agrega | Tema |
|---|---|---|
| `paso1-leer` | Servidor y ruta `GET /api/participantes` | API |
| `paso2-registrar` | `POST` y números de respuesta (201, 400, 404) | API |
| `paso3-seguridad` | Validación, `helmet`, `cors`, límite de peticiones, `.env` y token | Seguridad |
| `paso4-base-de-datos` | Datos reales en Supabase | API + datos |
| `paso5-archivos` | Subida de foto con revisión | Archivos |
| `paso6-final` | Votos, ranking y listo para Vercel | Todo junto |

- **Alumnos:** lean `GUIA-ALUMNO.md`.
- **Profesor:** lee `GUION-PROFESOR.md`.

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

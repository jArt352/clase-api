# Guion del profesor

**Método:** todos hacen lo mismo que tú. Tú proyectas tu pantalla, haces el paso, ellos lo repiten y comprueban.
Antes de seguir, pregunta: "¿a quién le salió?". Si menos de 4 de cada 5 lo lograron, espera o pasa la carpeta del paso.

No hace falta que sepas todo. Ejecuta el código, léelo con la analogía y, si dudas, pregunta a una IA:
*"explícame esta línea como si tuviera 12 años"*.

## Antes de las 3 p. m. (obligatorio)

- [ ] Abre la carpeta `paso6-final`, copia `.env.example` a `.env`, ejecuta `npm install` y `npm run dev`. Debe abrir en http://localhost:3000.
- [ ] Prueba los 6 pasos en tu laptop al menos una vez.
- [ ] El deploy de `paso6-final` ya está probado en Vercel (plan Hobby, gratis): https://clase-api-five.vercel.app. Verificado: `/`, `/proyector.html`, la API, la subida de foto y el voto único. No pidió tarjeta.
- [ ] Vercel pide el código de verificación en dos pasos si lo tienes activado. Ten tu app de autenticación a mano.
- [ ] Los alumnos que aún no tengan cuenta de Vercel deben crearla antes de la clase (con "Continue with GitHub").
- [ ] Sube las 6 carpetas a un repositorio público de GitHub, para que los alumnos las descarguen.
- [ ] Ten listas las claves `SUPABASE_URL` y `SUPABASE_KEY` (la **publishable**) en una diapositiva. **Nunca** muestres una clave `secret` ni `service_role`.
- [ ] Pide a los alumnos que instalen Node, VS Code y creen cuentas de GitHub y Vercel **antes** de la clase.
- [ ] Muro de demostración (Supabase + GitHub Pages): https://jart352.github.io/muro-disfraces/proyector.html

## Horario

| Hora | Bloque | Min |
|---|---|---|
| 3:00 | Bienvenida, demo del muro con QR, revisar instalación | 20 |
| 3:20 | **Paso 1**: GET, tu primera ruta | 30 |
| 3:50 | **Paso 2**: POST y números de respuesta | 25 |
| 4:15 | Descanso | 10 |
| 4:25 | **Paso 3**: seguridad | 35 |
| 5:00 | **Paso 4**: base de datos real | 30 |
| 5:30 | Descanso | 10 |
| 5:40 | **Paso 5**: archivos | 30 |
| 6:10 | **Paso 6**: votos | 15 |
| 6:25 | **Publicar en Vercel** | 25 |
| 6:50 | Votación en vivo y cierre | 10 |

Si vas corto de tiempo, muestra tú el Paso 6 y que lo copien de la carpeta.
**No recortes** el ataque del Paso 3 ni la foto del Paso 5.

## Qué decir y qué comprobar en cada paso

### Bienvenida (20 min)
- Proyecta el muro con el QR y que todos entren desde el celular. Gancho: "esto es lo que vamos a entender por dentro".
- Teatro de 5 min: 3 voluntarios actúan de cliente, mesero y cocina pasándose papelitos.
- Revisa que todos tengan `node -v` funcionando.

### Paso 1 (30 min)
- **Dices:** "La API es el mesero. `GET` es pedir el menú."
- **Haces:** `npm install`, `npm run dev`, abres `/api/participantes` y luego la página.
- **Comprueban:** ven 3 participantes en JSON y las tarjetas en la página.
- **Si falla:** "Cannot GET" = la ruta está mal escrita o el servidor no reinició.

### Paso 2 (25 min)
- **Dices:** "`POST` es hacer un pedido nuevo. El número de respuesta dice cómo salió."
- **Haces:** agregas `express.json()` y la ruta POST; pruebas 201, 400 y 404 en Thunder Client.
- **Comprueban:** registran su disfraz en la página y aparece la tarjeta.

### Paso 3 (35 min), el favorito del público
- **Dices:** "El portero. Nunca confíes en el cliente."
- **Ataque (10 min):** nombre vacío, 5000 letras, `<script>`. Mira cómo se rompe.
- **Defensa (15 min):** `validar`, `helmet`, `cors`, límite de peticiones y `.env`.
- **Juego (10 min):** en parejas intentan romper la API del compañero.
- **Comprueban:** 401 sin token, 200 con token, 429 tras muchas peticiones.
- **Si falla:** `Cannot find module` = olvidaron `npm install helmet cors express-rate-limit dotenv`.

### Paso 4 (30 min)
- **Dices:** "Hasta ahora los datos se perdían al reiniciar. Ahora hay una base de datos de verdad."
- **Haces:** pones `SUPABASE_URL` y `SUPABASE_KEY` en `.env`; cambias la lista por `listar()` y `crear()`.
- **Explica:** la clave publishable es pública por diseño y es segura porque la base tiene reglas. La `secret` nunca va en el navegador.
- **Comprueban:** su disfraz aparece también en el muro del profesor.
- **Si falla:** "Falta configurar SUPABASE_URL" = el `.env` está mal escrito o se llama distinto.

### Paso 5 (30 min)
- **Dices:** "El paquete por correo: se revisa antes de guardarlo."
- **Haces:** `npm install multer`, la ruta `/api/fotos`, subes una selfie.
- **Reto:** un PDF y un `.exe` renombrado a `.jpg`. Los dos deben rechazarse.
- **Si falla:** foto que no se ve = revisa la política de imágenes (CSP) en `helmet`.

### Paso 6 (15 min)
- **Dices:** "La regla de un voto por dispositivo vive en la base de datos, no en la página."
- **Comprueban:** votan una vez; el segundo intento responde 409.

### Publicar en Vercel (25 min)
- Hazlo en vivo con tu cuenta y que repitan. Pasos en `GUIA-ALUMNO.md`. Recuerda el botón **"Import single project"**.
- **Importante:** las variables `SUPABASE_URL`, `SUPABASE_KEY` y `ADMIN_TOKEN` se cargan en Vercel antes de pulsar Deploy.
- Pídeles que prueben su link desde el celular.

### Cierre (10 min)
- Votación en vivo en tu proyector.
- Repaso en 3 frases:
  1. Una API es un mesero.
  2. Valida todo: nunca confíes en el cliente.
  3. Los archivos también son un riesgo.
- Tarea: agregar un campo nuevo a su tarjeta.

## Límites que debes conocer

- **El límite de peticiones en Vercel** cuenta por instancia del servidor, así que no es un límite global. Para algo serio se usa un almacén compartido (como Redis).
- **El voto por dispositivo** se burla borrando los datos del navegador. Para algo serio hace falta login.
- **Todos los alumnos escriben en tu mismo Supabase.** Limpia cuando quieras desde el SQL Editor: `delete from participantes;`.
- **Importar en Vercel:** el repositorio tiene 6 carpetas y Vercel las detecta como 6 aplicaciones. Cada alumno debe pulsar **"Import single project"** junto a la carpeta que publica.

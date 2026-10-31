# Guion del profesor: clase de 3 h 40 min

**Backend, APIs, seguridad y manejo de archivos con IA** · Sábado 31 de octubre · 3:00 a 7:00 p. m.

Son **3 h 40 min de trabajo** más **2 descansos de 10 min**. Tienes **dos versiones** de la presentación (27 diapositivas cada una):

- `Clase-API-con-IA_PROFESOR.pptx`: **con notas del orador**. Es la que usas tú, en vista del presentador.
- `Clase-API-con-IA_ALUMNOS.pptx`: **sin notas**. Es la que compartes con los alumnos (por ejemplo, en PDF).

## Cómo funciona la clase

- **Los alumnos no programan: dirigen a una IA.** Pegan un prompt, copian el `server.js` que les devuelve, lo guardan y prueban.
- **Todos hacen lo mismo que tú**, al mismo tiempo. Tú lo haces en pantalla primero.
- **Los prompts están en `PROMPTS.md`.** Tú no necesitas saber el código: necesitas saber qué debe ver cada uno al terminar.
- **Si algo falla dos veces**, copian el `server.js` de la carpeta del paso (`paso1-leer`, `paso2-registrar`...). Nadie se queda atrás.

> Frase de cabecera: *"Hoy no vas a aprender a teclear código. Vas a aprender a dirigir a una IA, a comprobar lo que hace y a protegerlo."*

## Antes de las 3 p. m. (obligatorio)

**Tú:**

- [ ] Abre `paso0-inicio`, ejecuta `npm install` y `npm run dev`. Debe abrir en http://localhost:3000.
- [ ] Haz **los 6 pasos con tu IA** al menos una vez, usando solo `PROMPTS.md`.
- [ ] Ten abierto el proyector en tu pantalla: https://jart352.github.io/muro-disfraces/proyector.html
- [ ] Limpia el muro: en el SQL Editor de Supabase, `delete from participantes;`.
- [ ] Deja a mano la **URL de Supabase** y la clave **publishable** en una diapositiva o pizarra. **Nunca muestres una clave `secret` ni `service_role`.**
- [ ] Prueba tu wifi con 2 o 3 celulares reales.
- [ ] Tu app de verificación en dos pasos de Vercel, a mano.
- [ ] Impresos o en pantalla: el horario y este guion.

**Los alumnos (envíaselo hoy mismo):**

- [ ] Node.js 20 o más, VS Code y la extensión Thunder Client.
- [ ] Cuenta de GitHub y cuenta de Vercel (con "Continue with GitHub").
- [ ] Una IA abierta (ChatGPT, Claude, Gemini o la de su editor).
- [ ] El repositorio descargado: https://github.com/jArt352/clase-api (botón verde **Code > Download ZIP**).

## Horario de un vistazo

| Hora | Bloque | Min | Diapositivas |
|---|---|---|---|
| 3:00 | Bienvenida y gancho | 10 | 1 a 3 |
| 3:10 | Método, kit y Prompt 0 | 20 | 4 a 7 |
| 3:30 | Conceptos clave | 10 | 8 a 11 |
| 3:40 | **Paso 1**: ver participantes | 25 | 12 |
| 4:05 | **Paso 2**: registrar | 25 | 13 |
| 4:30 | **Descanso** | 10 | |
| 4:40 | **Paso 3**: seguridad | 35 | 14 a 16 |
| 5:15 | **Paso 4**: base de datos | 30 | 17 a 19 |
| 5:45 | **Descanso** | 10 | |
| 5:55 | **Paso 5**: fotos | 25 | 20 y 21 |
| 6:20 | **Paso 6**: votos | 10 | 22 |
| 6:30 | **Publicar en Vercel** | 20 | 23 |
| 6:50 | Votación en vivo y cierre | 10 | 24 a 27 |

## Cómo llevar el ritmo

- **El ciclo de cada paso es el mismo:** explico (3 min) → prompt (5) → pegar y guardar (5) → probar (5) → preguntar a la IA qué hizo (4) → ayudar a rezagados (3).
- **Semáforo:** pide que levanten una mano o pongan un ✅ en el chat del grupo cuando les salga. No avances hasta que **4 de cada 5** lo logren.
- **Rezagados:** que copien la carpeta del paso. Sigues y luego los ayudas en el descanso.
- **Ayudantes:** si hay, que se ubiquen en los extremos de la sala.
- Para los que terminen antes: *"Pídele a tu IA que te explique cada línea que cambió"*.

---

## Bloque 1 · 3:00 a 3:10 · Bienvenida y gancho (diapositivas 1 a 3)

| Min | Qué haces | Qué dices |
|---|---|---|
| 3:00 | Diapositiva 1. Saludas. | *"Hoy vamos a construir una aplicación real. No hace falta saber programar: ustedes dirigen a la IA y ella escribe el código."* |
| 3:02 | Diapositiva 2. | *"Al final cada uno tendrá una API propia, protegida, con fotos y publicada en internet. Todo gratis."* |
| 3:05 | Diapositiva 3. Abres el muro en el proyector y pides que escaneen el QR. | *"Escaneen, escriban su nombre y su disfraz y envíen. Miren la pantalla."* |
| 3:08 | Las tarjetas aparecen solas. | *"Acaban de usar una API: su celular le pidió algo a un servidor y el servidor respondió. Hoy aprenderemos cómo funciona por dentro."* |

**Comprobar:** al menos la mitad ve su tarjeta en el proyector.
**Si falla el wifi:** muestra el muro tú mismo y sigue; el gancho no es crítico.

## Bloque 2 · 3:10 a 3:30 · Método, kit y Prompt 0 (diapositivas 4 a 7)

| Min | Qué haces | Qué dices |
|---|---|---|
| 3:10 | Diapositiva 4. | *"Tú diriges, la IA escribe, los prompts son recetas. Si hoy no sabes nada de código, mejor: lo vas a entender con ejemplos."* |
| 3:13 | Diapositiva 5. Que abran VS Code con la carpeta `paso0-inicio`. En la terminal: `node -v`, `npm install`, `npm run dev`. | *"Primero comprobamos que todos tengan su kit. Levanten la mano si ya tienen Node."* |
| 3:20 | Diapositiva 6. Haces **una vez en vivo** el ciclo: copias un prompt de prueba, lo pegas, copias el código, pruebas. | *"Tres movimientos: pego el prompt, copio el server.js, pruebo. Si falla, prompt de rescate. Si falla dos veces, copio la carpeta del paso."* |
| 3:24 | Diapositiva 7. Pegan el **Prompt 0** de `PROMPTS.md` en su IA. | *"Este prompt le cuenta a la IA qué proyecto es y cómo debe responder. Se pega una sola vez. Debe responder solo «Entendido»."* |

**Comprobar:** todos ven la página en http://localhost:3000 (con un aviso de que faltan rutas) y su IA respondió "Entendido".
**Si falla:**
- *Node no instalado:* que se sienten con un compañero y sigan en su pantalla; instalen Node en el descanso.
- *No tienen IA:* que usen la de un compañero o la tuya; la idea es que vean el ciclo.
- *`npm install` falla:* revisa que estén dentro de la carpeta `paso0-inicio`.

## Bloque 3 · 3:30 a 3:40 · Conceptos clave (diapositivas 8 a 11)

| Min | Qué haces | Qué dices |
|---|---|---|
| 3:30 | Diapositiva 8, la agenda. | *"Este es el plan. Dos descansos. Al final todos publican."* |
| 3:31 | Diapositiva 9. | *"Seis palabras. No hay que memorizarlas: las verán todo el día."* |
| 3:33 | Diapositiva 10. **Teatro:** 3 voluntarios (comensal, mesero, cocina) se pasan papelitos con pedidos. | *"La página es el comensal, la API es el mesero y el servidor es la cocina. La seguridad es el portero. Los archivos son un paquete por correo."* |
| 3:37 | Diapositiva 11. | *"Pedimos con GET para ver y POST para crear. La respuesta trae un número: 200 listo, 400 pediste mal, 404 no existe, 429 vas muy rápido, 500 falló el servidor."* |

## Bloque 4 · 3:40 a 4:05 · Paso 1: ver los participantes (diapositiva 12)

**Objetivo:** que el servidor responda la lista de participantes y la página la muestre.

| Min | Qué haces | Qué dices |
|---|---|---|
| 3:40 | Muestras que la página dice "Esa ruta todavía no existe (404)". | *"La página le está pidiendo la lista al servidor y el servidor responde que no existe esa ruta. Hoy lo arreglamos con la IA."* |
| 3:43 | Copian el **prompt del paso 1** de `PROMPTS.md` y lo pegan en su IA. | *"Mientras la IA responde, lean el prompt: dice exactamente qué ruta queremos."* |
| 3:48 | Copian el `server.js` que devolvió la IA y lo pegan en su archivo. Guardan. | *"Reemplacen todo el contenido. Guarden con Ctrl+S."* |
| 3:53 | Abren http://localhost:3000/api/participantes y luego http://localhost:3000. | *"¿Ven a Ana, Luis y Marta? Entonces su API funciona."* |
| 3:58 | Piden a su IA: *"Explícame esta ruta como si tuviera 12 años"*. Dos voluntarios leen la respuesta. | *"No hace falta entender cada línea hoy. Hace falta saber qué hace la ruta."* |
| 4:02 | Ayudas a rezagados. | *"Si no les sale, copien `paso1-leer/server.js`."* |

**Debes ver:** 3 participantes en JSON y 3 tarjetas en la página.
**Si falla:**
- *"Cannot GET /api/participantes":* la ruta está mal escrita o el servidor no se reinició.
- *La IA devolvió solo un fragmento:* que le pidan *"dame el server.js COMPLETO"*.
- *Error de sintaxis al arrancar:* que pasen el error a la IA con el prompt de rescate.

## Bloque 5 · 4:05 a 4:30 · Paso 2: registrar (diapositiva 13)

**Objetivo:** que puedan registrar su disfraz desde la página.

| Min | Qué haces | Qué dices |
|---|---|---|
| 4:05 | Explicas POST. | *"GET es ver el menú, POST es hacer un pedido nuevo. Ahora la página quiere enviar tu disfraz."* |
| 4:07 | Prompt del paso 2. | *"Fíjense en lo que pedimos: que exija nombre y disfraz y que responda 201 o 400."* |
| 4:12 | Pegan y guardan. | |
| 4:16 | Registran su disfraz en la página. En Thunder Client: POST sin disfraz (400) y GET `/api/participantes/inventado` (404). | *"400 es 'pediste mal', 404 es 'no existe'. Son los números que habla el servidor."* |
| 4:21 | Pides a la IA que explique los números de respuesta. | |
| 4:25 | Rezagados y recap. | *"Su servidor ya recibe pedidos nuevos."* |

**Debes ver:** su tarjeta aparece al enviarla; sin disfraz responde 400; un id inventado responde 404.
**Si falla:** *"Faltan el nombre o el disfraz"* aunque lo escribieron: el servidor no usa `express.json()`; que usen el prompt de rescate o copien `paso2-registrar`.

### Descanso · 4:30 a 4:40

Aprovecha para ayudar a los rezagados y para preparar tu pantalla del paso 3.

## Bloque 6 · 4:40 a 5:15 · Paso 3: seguridad (diapositivas 14 a 16)

**Objetivo:** que el servidor se defienda de datos malos y abusos. **Es el bloque favorito del público.**

| Min | Qué haces | Qué dices |
|---|---|---|
| 4:40 | Diapositiva 14. Que **ataquen su propia página**: nombre vacío, 5000 letras (pega un texto largo) y `<script>alert(1)</script>`. | *"Ahora sean hackers. ¿Qué pasó? Probablemente aceptó todo. Regla de oro: nunca confíes en lo que manda el cliente."* |
| 4:50 | Diapositiva 15. | *"Ahora el portero. Validar es revisar el carnet. El límite de peticiones es no dejar entrar a quien empuja. Helmet son los candados. CORS decide qué otras páginas pueden usar tu API."* |
| 4:53 | Prompt del paso 3. | *"La IA les dirá qué comandos npm correr. Cópienlos tal cual."* |
| 4:58 | Pegan, guardan, instalan lo que diga la IA (`npm install helmet cors express-rate-limit`) y reinician. | |
| 5:03 | Repiten los ataques. Después envían 25 veces seguidas. | *"¿Ven el aviso 'Vas muy rápido'? Eso es el límite de peticiones: error 429."* |
| 5:07 | Diapositiva 16. **Cazafantasmas de bugs** en parejas, 4 min. Luego el **prompt de auditoría**. | *"Ahora rompan la API de su compañero. Después le pedimos a la IA que revise la nuestra."* |

**Debes ver:** nombre vacío o de 1 letra muestra un error claro; 25 envíos seguidos muestran "Vas muy rápido"; la página funciona sin errores.
**Si falla:**
- *`Cannot find module 'helmet'`:* no corrieron `npm install`. Que repitan el comando que dijo la IA.
- *La página ya no carga scripts o fotos:* la política de `helmet` quedó demasiado estricta; copien `paso3-seguridad/server.js`.
- *Se bloquean con 429 mientras prueban:* esperen un minuto.

## Bloque 7 · 5:15 a 5:45 · Paso 4: base de datos real (diapositivas 17 a 19)

**Objetivo:** que los disfraces se guarden en una base de datos y no se pierdan al reiniciar. **Es el paso más delicado: si ves que se complica, copia `paso4-base-de-datos`.**

| Min | Qué haces | Qué dices |
|---|---|---|
| 5:15 | Diapositiva 17. Reinicia tu servidor y muestra que la lista vuelve a 3. | *"Hasta ahora los datos vivían en la memoria: al reiniciar, se pierden. Ahora usamos una base de datos de verdad."* |
| 5:19 | Diapositiva 18. Das la `SUPABASE_URL` y `SUPABASE_KEY`. Que creen el archivo `.env`. | *"El `.env` es la llave de la casa: vive en tu computadora y nunca se sube a GitHub. La clave publishable es pública por diseño. La secret NUNCA va en el navegador."* |
| 5:23 | Diapositiva 19. | *"Las reglas de la base son el portero de la base: sin una regla que lo permita, nadie puede hacer nada."* |
| 5:26 | Prompt del paso 4. | *"No peguen su .env en la IA: solo escriban que existen esas variables."* |
| 5:32 | Pegan, guardan, instalan (`npm install dotenv`), crean `.env`, reinician. | |
| 5:37 | Registran su disfraz, **reinician el servidor** y comprueban que sigue ahí. | *"¿Sigue ahí? Entonces su servidor ya habla con una base de datos real."* |
| 5:42 | Rezagados. | |

**Debes ver:** su disfraz se guarda y sigue ahí tras reiniciar.
**Si falla:**
- *"Falta configurar SUPABASE_URL y SUPABASE_KEY":* el `.env` está mal escrito, en otra carpeta o con otro nombre.
- *Las fotos de otros no aparecen:* normal, aún no hay fotos.
- *Error 401 de Supabase:* revisaron mal la clave; que la copien otra vez.

### Descanso · 5:45 a 5:55

## Bloque 8 · 5:55 a 6:20 · Paso 5: archivos (diapositivas 20 y 21)

**Objetivo:** que puedan subir una selfie con revisión de seguridad.

| Min | Qué haces | Qué dices |
|---|---|---|
| 5:55 | Diapositiva 20. | *"El paquete por correo: la página lo achica, el servidor lo recibe, lo revisa y solo si es una imagen real lo guarda."* |
| 5:59 | Prompt del paso 5 e instalan `multer`. | |
| 6:04 | Pegan, guardan, reinician. Suben su selfie desde el celular o la laptop. | *"¿Aparece su foto en la tarjeta?"* |
| 6:08 | Diapositiva 21. **Demo tuya** en Thunder Client (3 min): POST a `/api/fotos` con un `.exe` renombrado a `.jpg` (400) y con un archivo de más de 2 MB (413). | *"La página ya revisa la foto, pero el servidor NO puede confiar en eso. Por eso vuelve a revisar los primeros bytes del archivo."* |
| 6:15 | Rezagados y recap. | |

**Debes ver:** su selfie en la tarjeta. Un PDF elegido en la página se rechaza.
**Si falla:**
- *La foto sale rota o aparece un emoji:* el servidor no devolvió la URL bien o `helmet` bloquea la imagen; copien `paso5-archivos`.
- *Error al subir:* la IA olvidó `multer.memoryStorage()`; usen el prompt de rescate.

## Bloque 9 · 6:20 a 6:30 · Paso 6: votos (diapositiva 22)

| Min | Qué haces | Qué dices |
|---|---|---|
| 6:20 | Diapositiva 22. | *"La regla 'un voto por persona' vive en la base de datos y no en la página, porque la página se puede manipular."* |
| 6:22 | Prompt del paso 6. Pegan y guardan. | |
| 6:25 | Votan una vez; intentan votar dos veces. | *"¿Qué dice el segundo intento? 'Ya votaste'."* |
| 6:28 | Limitación honesta. | *"Quien borre los datos de su navegador podría votar otra vez. En algo serio se usa login."* |

**Si vas corto de tiempo:** muestra este paso tú y que copien `paso6-final`.

## Bloque 10 · 6:30 a 6:50 · Publicar en Vercel (diapositiva 23)

**Objetivo:** que cada uno tenga su link público. Haz el proceso en vivo con tu cuenta.

| Min | Qué haces | Qué dices |
|---|---|---|
| 6:30 | Diapositiva 23. | *"Hoy publicamos gratis. Necesitamos dos cuentas: GitHub, que guarda el código, y Vercel, que lo pone en internet."* |
| 6:33 | **Subir a GitHub:** en github.com, **New repository**, y luego **uploading an existing file**. Arrastran `server.js`, `package.json`, `package-lock.json` y la carpeta `public`. | *"Importante: NO suban la carpeta `node_modules` ni el archivo `.env`."* |
| 6:40 | En vercel.com: **Continue with GitHub**, **Add New > Project**, importan su repositorio. Si piden verificación en dos pasos, escriben el código de su app. | |
| 6:43 | **Environment Variables:** `SUPABASE_URL` y `SUPABASE_KEY`. Pulsan **Deploy**. | *"Las claves se escriben acá, no en el código."* |
| 6:47 | Abren su link desde el celular. | *"Compartan su link en el grupo."* |

**Debes ver:** su página abre en `algo.vercel.app` y puede registrar y votar.
**Si falla:**
- *Vercel muestra varias aplicaciones:* pulsen **"Import single project"** en su carpeta (solo pasa si subieron más de una carpeta).
- *La página carga pero no hay datos:* faltan las variables de entorno; agréguenlas y pulsen **Redeploy**.
- *No les da tiempo:* que lo terminen en casa con `PROMPTS.md`; muestra tu ejemplo: https://clase-api-five.vercel.app

## Bloque 11 · 6:50 a 7:00 · Votación en vivo y cierre (diapositivas 24 a 27)

| Min | Qué haces | Qué dices |
|---|---|---|
| 6:50 | Diapositiva 24. Proyectas el muro y que escaneen el QR, suban su disfraz y voten. Pulsas **Revelar ganador**. | *"Última dinámica: voten por su favorito. ¡Y el ganador es..."* (pantalla con confeti) |
| 6:55 | Diapositiva 25. Que repitan en voz alta las 3 frases. | *"Una API es un mesero. Valida todo. Los archivos también son un riesgo."* |
| 6:58 | Diapositivas 26 y 27. Tarea y links. | *"Hoy dirigieron una IA para crear, proteger y publicar una aplicación real. Eso es un proyecto para su portafolio."* |

---

## Si vas corto de tiempo (recorta en este orden)

1. El **teatro** del restaurante (diapositiva 10): menciónalo en 1 minuto.
2. El **juego Cazafantasmas** del paso 3: solo la auditoría con la IA.
3. El **paso 6 (votos)**: lo muestras tú y copian `paso6-final`.
4. Para el **deploy**: haz solo la demo tuya y que lo repitan en casa.

**No recortes** el ataque y las defensas del paso 3, ni la subida de la foto del paso 5.

## Problemas frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| "Cannot GET /api/..." | La ruta no está o el servidor no reinició | Guardar el archivo y revisar que `npm run dev` siga corriendo |
| `Cannot find module 'xxx'` | Falta `npm install xxx` | Correr el comando que dijo la IA |
| La IA devuelve un fragmento | No le pidieron el archivo completo | *"Dame el server.js COMPLETO"* |
| La IA cambió otros archivos | Estaban usando una IA en el editor | Deshacer y repetir el prompt recordando que solo se toca `server.js` |
| Error de sintaxis al arrancar | Mala copia o pegado | Prompt de rescate con el error exacto |
| 429 mientras prueban | El límite de peticiones | Esperar un minuto |
| La página no carga fotos o scripts | `helmet` muy estricto | Copiar la carpeta del paso |
| "Falta configurar SUPABASE_URL" | El `.env` mal escrito o en otra carpeta | Revisar nombre, ubicación y que el servidor se reinició |
| Vercel pide un código | Verificación en dos pasos | Escribir el código de su app de autenticación |

## Frases salvavidas

- *"Buena pregunta: ¿qué le pedirías a tu IA para averiguarlo?"*
- *"Si no sabes qué hace una línea, pídele a tu IA que te la explique como si tuvieras 12 años."*
- *"Nadie se queda atrás: copien la carpeta del paso y seguimos."*
- *"El error no es un fracaso: es información. Cópienlo y péguenlo en la IA."*

## Reglas con la IA (repítelas)

- **Nunca pegues claves secretas, ni tu archivo `.env`, en la IA.**
- Pídele siempre el archivo **completo**.
- Comprueba tú mismo lo que hace: **la IA se equivoca**.
- Si dos intentos no funcionan, cambia de estrategia: copia la carpeta del paso.

## Lo que debes saber (límites)

- **Todos los alumnos escriben en tu mismo Supabase.** Limpia cuando quieras con `delete from participantes;`.
- **El voto por dispositivo** se burla borrando los datos del navegador. Para algo serio hace falta login.
- **El límite de peticiones en Vercel** cuenta por instancia; sirve para la demostración, no como protección real.
- **Los prompts no se probaron con ChatGPT, Gemini ni Claude de los alumnos.** Están escritos a partir del código ya probado y fijan la API exacta para que la página siempre funcione. Haz tú todo el recorrido antes de la clase y ajusta los prompts si tu IA responde distinto.

# Guía del alumno: construye tu API con tu IA

**No necesitas saber programar.** Hoy tú diriges y tu IA escribe el código. Todos hacemos los mismos pasos, al mismo tiempo, y terminamos con una aplicación publicada en internet.

## Lo que vamos a lograr

| Tema | Es como... | Lo que lograrás |
|---|---|---|
| **API** | Un mesero que lleva tu pedido a la cocina | Tu página pide y guarda disfraces |
| **Seguridad** | Un portero que revisa a quien entra | Tu servidor se defiende de datos malos y abusos |
| **Archivos** | Un paquete por correo que se revisa antes de guardar | Subes la foto de tu disfraz |

## Lo que necesitas (todo gratis)

- Una IA: ChatGPT, Claude, Gemini, Copilot o la de tu editor
- **VS Code**, **Node.js 20+** (`node -v`) y la extensión **Thunder Client**
- Una cuenta de **GitHub** y una de **Vercel** (se crea con "Continue with GitHub")
- Las claves de la base de datos: te las da el profesor

## Cómo trabajamos: 3 movimientos

1. **Pegas el prompt** del paso en tu IA.
2. **Copias el `server.js`** que te devuelve y lo pegas en tu archivo. Guardas.
3. **Pruebas.** Comparas con lo que dice "Debes ver".

Todos los prompts están en **[PROMPTS.md](PROMPTS.md)**. Solo copias y pegas.

> Si algo falla, usa el **prompt de rescate**. Si falla dos veces, **copia el `server.js` de la carpeta del paso** y sigue con el grupo. Nadie se queda atrás.

## Antes de empezar

```bash
cd paso0-inicio
npm install
npm run dev
```

Abre http://localhost:3000. Verás la página, pero le faltan rutas. Las vamos a crear con la IA.

## Los 6 pasos

| Paso | Le pides a la IA... | Debes ver |
|---|---|---|
| **1** | Una ruta para **ver** los participantes | Las 3 tarjetas de ejemplo |
| **2** | Una ruta para **registrar** uno nuevo | Tu tarjeta aparece al enviarla |
| **3** | Que **proteja** el servidor (el portero) | Errores claros y el aviso "Vas muy rápido" |
| **4** | Que **guarde en una base de datos real** | Tu disfraz sigue ahí al reiniciar |
| **5** | Que acepte **fotos** con revisión | Tu selfie en la tarjeta; un PDF se rechaza |
| **6** | Que cuente **votos** (uno por persona) | Votas una vez; el segundo intento se rechaza |

## Palabras que vas a escuchar

| Palabra | Significa |
|---|---|
| **Servidor** | Un programa que atiende pedidos y guarda cosas |
| **API** | La lista de pedidos que el servidor sabe atender |
| **Ruta** | Un pedido concreto, como `/api/participantes` |
| **JSON** | La forma de escribir datos: `{"nombre": "Ana"}` |
| **Número de respuesta** | 200/201 listo · 400 pediste mal · 404 no existe · 500 falló el servidor |
| **Variable de entorno** | Una clave secreta que vive fuera del código (el `.env`) |

## Publicar tu proyecto

Los pasos están en **[PROMPTS.md](PROMPTS.md)**, sección "Publicar en Vercel". Lo haremos juntos, al final.

## Lo que lograste hoy

- Dirigiste a una IA para construir una **API** con rutas.
- Le pediste que la **protegiera** de datos malos y abusos.
- Le agregaste **fotos** con revisión de seguridad.
- La conectaste a una **base de datos real** y la **publicaste**.

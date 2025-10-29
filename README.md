# Kábu 🐾

<!-- [![Estado del Deploy](https://img.shields.io/vercel/deployment/username/repo-name?logo=vercel&label=estado)](https://Kábu.app) -->

[![Licencia: MIT](https://img.shields.io/badge/Licencia-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Reuniendo mascotas con sus familias, más rápido.

Kábu es una aplicación web open-source diseñada para conectar instantáneamente a dueños de mascotas con su comunidad local cuando una mascota se pierde o es encontrada. A diferencia de los grupos de Facebook estáticos, Kábu utiliza tecnología geoespacial, alertas en tiempo real y viralización social para maximizar las posibilidades de un reencuentro feliz.

![kabu](https://github.com/user-attachments/assets/847d9192-09bb-4d5d-826f-b606be00348c)

## 🚀 Características Principales

Esta no es solo otra app de "CRUD". El núcleo de Kábu está construido sobre funciones avanzadas de base de datos para resolver problemas del mundo real.

- 📍 **Búsqueda Geoespacial en Tiempo Real:** Filtra y visualiza reportes de mascotas perdidas/encontradas en un mapa interactivo, todo potenciado por PostGIS.
- 🔔 **Zonas de Alerta Inteligentes:** Los usuarios pueden _dibujar un polígono_ en un mapa (ej: "mi barrio") y recibir notificaciones push web instantáneas si una mascota es reportada dentro de esa zona.
- 🚀 **Viralización Social Dinámica:** Cada reporte genera automáticamente un póster de "SE BUSCA" optimizado para redes sociales. Al compartir un enlace en WhatsApp, X (Twitter) o Facebook, se muestra una imagen rica (`<meta property="og:image">`) en lugar de un simple enlace.
- 💬 **Chat Anónimo y Seguro:** Permite al "dueño" y a quien "encontró" la mascota chatear en tiempo real sin revelar números de teléfono u otra información personal.
- 🔍 **Búsqueda de Texto Difusa (Fuzzy Search):** ¿El reporte dice "labradr chocolatw"? No importa. La búsqueda por `pg_trgm` puede encontrar "labrador chocolate" sin problemas.
- 🔒 **Seguridad por Defecto:** Construido con Políticas de Seguridad a Nivel de Fila (RLS) de Supabase, asegurando que un usuario solo pueda editar sus propios reportes o acceder a sus propios chats.
- ⏱️ **Límite de Publicaciones (Rate Limiting):** Previene el spam permitiendo solo un número de reportes por usuario en un período de 24 horas, controlado a nivel de base de datos.

---

## 🛠️ Tech Stack

El stack está elegido para ser moderno, escalable y eficiente, poniendo la lógica pesada en la base de datos.

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Backend & Base de Datos:** [Supabase](https://supabase.com/) (PostgreSQL Alojado)
- **Búsqueda Geoespacial:** [PostGIS](https://postgis.net/) (con índices GIST)
- **Búsqueda de Texto:** [pg_trgm](https://www.postgresql.org/docs/current/pgtrgm.html) (con índices GIN)
- **Tiempo Real:** [Supabase Realtime](https://supabase.com/realtime) (para Chat y Notificaciones)
- **Notificaciones Push:** [Web Push API (VAPID)](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- **Imágenes Dinámicas:** [Vercel OG / `ImageResponse`](https://vercel.com/docs/functions/edge-functions/og-image-generation)
- **UI:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Hosting:** [Vercel](https://vercel.com/) (Frontend) & Supabase (Backend/DB)

---

## 🏁 Cómo Empezar

Puedes levantar tu propia instancia de Kábu en minutos.

### 1. Prerrequisitos

- Node.js (v18+)
- `pnpm` (o `npm`/`yarn`)
- Una cuenta de [Supabase](https://supabase.com)
- Una cuenta de [Vercel](https://vercel.com/) (recomendado)

### 2. Instalación Local

1.  **Clonar el repositorio:**

    ```bash
    git clone [https://github.com/tu-usuario/kabu.git](https://github.com/tu-usuario/kabu.git)
    cd kabu
    ```

2.  **Instalar dependencias:**

    ```bash
    pnpm install
    ```

3.  **Configurar variables de entorno:**
    Copia el archivo `.env.local.example` a `.env.local` y rellena las variables de tu proyecto de Supabase.

    ```bash
    cp .env.local.example .env.local
    ```

    Necesitarás como mínimo:

    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `NEXT_PUBLIC_VAPID_PUBLIC_KEY` (Genera esto usando una librería VAPID)

4.  **Configurar la Base de Datos Supabase:**
    Este es el paso más importante. Ve al **SQL Editor** en tu panel de Supabase y ejecuta los scripts ubicados en la carpeta `/supabase` en el siguiente orden:

    - **`1-extensions.sql`**: Habilita las extensiones `postgis` y `pg_trgm`.
    - **`2-schema.sql`**: Crea todas las tablas (`sightings`, `chat_rooms`, `comments`, `push_subscriptions`, etc.).
    - **`3-rpc.sql`**: Crea todas las funciones de PostgreSQL (`insert_sighting_if_allowed`, `get_or_create_chat_room`, `nearby_sightings`, `search_sightings_advanced`, etc.).
    - **`4-rls.sql`**: Aplica todas las Políticas de Seguridad a Nivel de Fila (RLS) para proteger los datos.

5.  **Correr el proyecto:**
    ```bash
    pnpm dev
    ```

¡Abre [http://localhost:3000](http://localhost:3000) y deberías ver la aplicación funcionando!

---

## 🧠 Arquitectura y Lógica del Backend

El verdadero poder de esta aplicación reside en cómo delega la lógica de negocio compleja a PostgreSQL a través de funciones RPC (Remote Procedure Call).

### Búsqueda Geoespacial (PostGIS)

- **Problema:** ¿Cómo encontrar mascotas "cerca de mí" eficientemente?
- **Solución:** Usamos la función RPC `nearby_sightings(lat, long, distance_meters)`.
- **Cómo funciona:** Esta función utiliza `ST_DWithin` de PostGIS, que busca en un radio (ej: 20km) usando el índice GIST en la columna `location` (de tipo `geography`). Esto es órdenes de magnitud más rápido que traer todos los puntos y filtrarlos en el cliente.

### Búsqueda de Texto Difusa (pg_trgm)

- **Problema:** Los usuarios escriben mal. "Canishe" no coincide con "Caniche".
- **Solución:** Usamos la RPC `search_sightings_advanced(query_text, lat, long)`.
- **Cómo funciona:** Habilita la extensión `pg_trgm` y crea índices GIN. La función concatena `raza`, `color` y `descripcion` y usa el operador `%` (similaridad) para encontrar coincidencias relevantes, ordenándolas por `similarity()` y luego por distancia.

### Chat Anónimo (Supabase Realtime)

- **Problema:** Permitir la comunicación sin comprometer la privacidad (ej: número de WhatsApp).
- **Solución:** Un sistema de chat 1-a-1 anónimo.
- **Flujo:**
  1.  Un usuario hace clic en "Contactar".
  2.  El cliente llama a la RPC `get_or_create_chat_room(sighting_id)`.
  3.  Esta función (con `security definer`) encuentra o crea una `chat_room` y añade al dueño del reporte (Usuario A) y al usuario actual (Usuario B) a la tabla `chat_room_participants`.
  4.  El cliente es redirigido a `/chat/[room_id]`.
  5.  La página se suscribe al canal de Supabase Realtime para esa sala (`chat_room_${roomId}`).
  6.  Las RLS aseguran que solo los participantes puedan leer o escribir mensajes en esa sala.

### Notificaciones Push y Zonas de Alerta

- **Problema:** ¿Cómo notificar a un usuario _exactamente_ cuando aparece una mascota en su área de interés?
- **Solución:** Zonas de Alerta personalizadas + Web Push.
- **Flujo:**
  1.  Un usuario dibuja un polígono (`geography`) en un mapa y lo guarda como una `alert_zone`.
  2.  Cuando otro usuario crea un nuevo reporte (`sighting`), un **Trigger de Base de Datos** (o una Serverless Function) se dispara.
  3.  Esta función (usando `ST_Intersects`) comprueba si el `location` (punto) del nuevo reporte intersecta con alguna `alert_zone` (polígono) guardada.
  4.  Si hay una intersección, se busca la `push_subscription` del dueño de esa zona y se le envía una notificación push con los detalles.

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si tienes una idea para una nueva característica o encuentras un bug, por favor abre un _issue_ para discutirlo.

1.  Haz un Fork del proyecto.
2.  Crea tu rama de característica (`git checkout -b feature/AmazingFeature`).
3.  Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`).
4.  Haz push a la rama (`git push origin feature/AmazingFeature`).
5.  Abre un Pull Request.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

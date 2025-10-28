// Escucha eventos 'push'
self.addEventListener("push", (event) => {
  let data;
  try {
    // El payload viene como texto, lo parseamos como JSON
    data = event.data.json();
  } catch (error) {
    console.error("Error al parsear payload:", error);
    data = {
      title: "Notificación",
      body: event.data.text(),
    };
  }

  const { title, body, icon, image, ...options } = data;

  // Opciones para la notificación
  const notificationOptions = {
    body: body,
    icon: icon || "/icons/icon-192x192.png", // Icono por defecto
    image: image, // Imagen grande opcional
    badge: "/icons/badge-72x72.png", // Icono para la barra de estado (Android)
    data: options.data, // Datos adicionales (ej. URL a abrir)
    ...options,
  };

  // Muestra la notificación
  event.waitUntil(
    self.registration.showNotification(title, notificationOptions)
  );
});

// (Opcional) Maneja clics en la notificación
self.addEventListener("notificationclick", (event) => {
  event.notification.close(); // Cierra la notificación

  // Abre la URL especificada en los datos o la raíz del sitio
  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // Si el sitio ya está abierto, enfoca esa pestaña
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      // Si no, abre una nueva pestaña
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

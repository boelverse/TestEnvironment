importScripts("https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js");

const messaging = firebase.messaging();

self.addEventListener("install", (event) => {
  console.log("Service Worker installed.");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated.");
  event.waitUntil(self.clients.claim());
});

// Listen for background messages from Firebase
messaging.onBackgroundMessage((payload) => {
  console.log("[service-worker.js] Received background message ", payload);

  // Custom implementation for showing notifications
  if (payload.notification) {
    const notificationTitle = payload.notification.title || "Default Title";
    const notificationOptions = {
      body: payload.notification.body || "Default Body",
      icon: payload.notification.icon || "/default-icon.png",
      data: payload.data || {}, // Pass additional data if needed
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  }
});

// Handle notification click events
self.addEventListener("notificationclick", (event) => {
  console.log("[service-worker.js] Notification click received.", event);
  event.notification.close();

  // Custom logic for handling notification clicks
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === event.notification.data.url && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
    );
  }
});

// Listen for messages from the app (if needed)
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    console.log("Skipping waiting and activating new Service Worker.");
    self.skipWaiting();
  }
});
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");


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
  console.log("[Service Worker] Background message ontvangen:", payload);
  
  if (!payload.notification) return;

  const { title, body, icon } = payload.notification;

  // Controleer of de notificatie al bestaat
  self.registration.getNotifications().then((existingNotifications) => {
    const alreadyExists = existingNotifications.some((n) => n.title === title && n.body === body);
    
    if (!alreadyExists) {
      self.registration.showNotification(title, {
        body,
        icon,
      });
    }
  });
});


// Listen for messages from the app (if needed)
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    console.log("Skipping waiting and activating new Service Worker.");
    self.skipWaiting();
  }
});
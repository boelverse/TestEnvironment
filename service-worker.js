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

// Listen for messages from the app (if needed)
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    console.log("Skipping waiting and activating new Service Worker.");
    self.skipWaiting();
  }
});

// Unregister previous service workers and register a new one
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async function () {
    try {
      // Get all service worker registrations
      const registrations = await navigator.serviceWorker.getRegistrations();

      // Unregister each service worker
      for (const registration of registrations) {
        console.log('Unregistering service worker:', registration);
        await registration.unregister();
      }

      // Register the new service worker
    } catch (error) {
      console.error('Error during service worker registration:', error);
    }
  });
}
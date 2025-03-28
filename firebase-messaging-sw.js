importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js"
);

// Necessary to receive background messages:
const messaging = firebase.messaging();

// Optional:
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

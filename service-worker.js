// service-worker.js

self.addEventListener("install", event => {
  console.log("Service Worker yüklendi");
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  console.log("Service Worker aktif oldu");
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("https://imaginative-meerkat-24d0f9.netlify.app/")
  );
});

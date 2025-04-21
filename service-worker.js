// service-worker.js

self.addEventListener("install", (event) => {
  console.log("✅ Service Worker yüklendi.");
});

self.addEventListener("activate", (event) => {
  console.log("🔄 Service Worker aktif.");
});

self.addEventListener("fetch", (event) => {
  // Cache işlemleri gerekiyorsa buraya eklenebilir
});

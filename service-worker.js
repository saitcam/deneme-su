self.addEventListener('push', function(event) {
  var options = {
    body: event.data.text(),
    icon: 'icon.png',
    badge: 'icon.png'
  };

  event.waitUntil(
    self.registration.showNotification('💧 Su Zamanı!', options)
  );
});

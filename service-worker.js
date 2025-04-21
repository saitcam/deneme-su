self.addEventListener('push', function (event) {
  const options = {
    body: event.data.text(),
    icon: 'su_ikonu.png',
    badge: 'su_ikonu.png'
  };
  
  event.waitUntil(
    self.registration.showNotification('Su içmeyi unutma! 💧', options)
  );
});

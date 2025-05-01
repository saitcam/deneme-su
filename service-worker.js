self.addEventListener('push', function(event) {
  const options = {
    body: event.data.text(),
    icon: 'icon.png',
    badge: 'icon.png',
    actions: [
      { action: 'drink-water', title: '💧 Su İçtim', icon: 'icon.png' },
      { action: 'snooze', title: '⏰ Ertele', icon: 'icon.png' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('💧 Su Zamanı!', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  if (event.action === 'drink-water') {
    console.log('Kullanıcı su içtiğini bildirdi.');
  } else if (event.action === 'snooze') {
    console.log('Kullanıcı hatırlatmayı erteledi.');
  } else {
    event.waitUntil(
      clients.openWindow('https://imaginative-meerkat-24d0f9.netlify.app/')
    );
  }
  event.notification.close();
});

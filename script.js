let count = 0;
const defaultGoal = 2000;
let goal = defaultGoal;

// Sayfa yüklendiğinde çalışacak
window.addEventListener('load', () => {
  // 1) Hedefi yükle veya varsayılan ata
  const storedGoal = localStorage.getItem('dailyGoal');
  goal = storedGoal ? Number(storedGoal) : defaultGoal;
  localStorage.setItem('dailyGoal', goal);

  // 2) Input ve ekranda göster
  document.getElementById('goalInput').value = goal;
  document.getElementById('goalDisplay').innerText = goal;

  // 3) Su miktarını yükle
  const storedWater = localStorage.getItem('water');
  count = storedWater ? Number(storedWater) : 0;

  updateDisplay();
});

function addWater(amount) {
  count = Math.min(count + amount, goal);
  localStorage.setItem('water', count);
  updateDisplay();
}

function resetCounter() {
  count = 0;
  localStorage.setItem('water', count);
  updateDisplay();
}

function saveGoal() {
  const input = document.getElementById('goalInput').value;
  goal = input ? Number(input) : defaultGoal;
  localStorage.setItem('dailyGoal', goal);
  document.getElementById('goalDisplay').innerText = goal;

  // Eğer sayaç yeni hedeften büyükse düzelt
  if (count > goal) {
    count = goal;
    localStorage.setItem('water', count);
  }

  updateDisplay();
  showToast('Günlük hedefiniz kaydedildi');
}

function updateDisplay() {
  const percent = goal > 0 ? (count / goal) * 100 : 0;
  document.getElementById('progress-bar').style.width = percent + '%';
  document.getElementById('progress-text').innerText = `${count} / ${goal} ml`;
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// —————— Bildirim Sistemi Başlangıcı ——————
if ('Notification' in window && navigator.serviceWorker) {
  // 1) Service Worker kaydı
  navigator.serviceWorker
    .register('service-worker.js')
    .then(() => console.log('Service Worker kayıt edildi.'))
    .catch(err => console.log('SW kaydında hata:', err));

  // 2) Bildirim izni isteme
  Notification.requestPermission().then(permission => {
    console.log('Bildirim izni:', permission);
  });

  // 3) Bildirim gönderen fonksiyon
  function sendNotification() {
    if (Notification.permission === 'granted') {
      new Notification('Su içmeyi unutma! 💧', {
        body: 'Günde 2 litre su içmeyi hedefle!',
        icon: 'su_ikonu.png',
        tag: 'su-notifikasyon'
      });
    }
  }

  // 4) Zamanlayıcı (1 saatte bir)
  setInterval(sendNotification, 3600000);
}
// —————— Bildirim Sistemi Sonu ——————

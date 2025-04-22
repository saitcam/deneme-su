
let count = 0;
const defaultGoal = 2000;
let goal = defaultGoal;

window.addEventListener('load', () => {
  const storedGoal = localStorage.getItem('dailyGoal');
  goal = storedGoal ? Number(storedGoal) : defaultGoal;
  localStorage.setItem('dailyGoal', goal);

  document.getElementById('goalInput').value = goal;
  document.getElementById('goalDisplay').innerText = goal;

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

if ("Notification" in window && navigator.serviceWorker) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(() => console.log("Service Worker kayıt edildi."))
    .catch(err => console.log("SW kaydında hata:", err));

  Notification.requestPermission().then(permission => {
    console.log("Bildirim izni:", permission);
  });

  function sendNotification() {
    if (Notification.permission === "granted") {
      new Notification("Su içmeyi unutma! 💧", {
        body: "Günde 2 litre su içmeyi hedefle!",
        icon: "su_ikonu.png",
        tag: "su-notifikasyon",
      });
    }
  }

  setInterval(sendNotification, 3600000);
}
// 🌙 Karanlık Mod - Tema Geçişi
const toggleButton = document.getElementById('theme-toggle');
const body = document.body;

// Sayfa yüklendiğinde tema kontrolü
window.onload = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    toggleButton.textContent = '🌞';
  }
};

// Tıklama ile geçiş
toggleButton.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDark = body.classList.contains('dark-mode');
  toggleButton.textContent = isDark ? '🌞' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

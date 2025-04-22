let total = 0;
const totalDisplay = document.getElementById("total");

function addWater(amount) {
  total += amount;
  totalDisplay.textContent = total;
}

function resetTotal() {
  total = 0;
  totalDisplay.textContent = total;
}

// 🌙 Karanlık Mod
const toggleButton = document.getElementById('theme-toggle');
const body = document.body;

window.onload = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    toggleButton.textContent = '🌞';
  }

  // 🔔 Bildirim izni iste
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
};

toggleButton.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDark = body.classList.contains('dark-mode');
  toggleButton.textContent = isDark ? '🌞' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// 🔔 Su içme bildirimi gönder
function sendWaterReminder() {
  if (Notification.permission === "granted") {
    new Notification("💧 Su zamanı!", {
      body: "Hadi bir bardak su iç! 🥤",
      icon: "icon.png" // İsteğe bağlı
    });
  }
}

// Her 30 dakikada bir bildir
setInterval(sendWaterReminder, 30 * 60 * 1000); // 30 dakika

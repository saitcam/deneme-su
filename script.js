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
let total = 0;
const totalDisplay = document.getElementById("total");

function updateDisplay() {
  totalDisplay.textContent = total;
  localStorage.setItem("totalWater", total); // 💾 Veriyi kaydet
}

function addWater(amount) {
  total += amount;
  updateDisplay();
}

function resetTotal() {
  total = 0;
  updateDisplay();
}

// 🔁 Sayfa yüklenince LocalStorage'dan veri çek
window.onload = () => {
  const savedTotal = localStorage.getItem("totalWater");
  if (savedTotal) {
    total = parseInt(savedTotal);
    updateDisplay();
  }

  // Tema ayarı
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    document.getElementById('theme-toggle').textContent = '🌞';
  }

  // 🔔 Bildirim izni
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
};

// 🌙 Tema geçişi
const toggleButton = document.getElementById('theme-toggle');
toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  toggleButton.textContent = isDark ? '🌞' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// 🔔 Hatırlatma bildirimi
function sendWaterReminder() {
  if (Notification.permission === "granted") {
    new Notification("💧 Su zamanı!", {
      body: "Hadi bir bardak su iç! 🥤",
      icon: "icon.png"
    });
  }
}

setInterval(sendWaterReminder, 30 * 60 * 1000);
// 📅 Haftalık veri hazırlığı
function getTodayKey() {
  const today = new Date();
  return `water-${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
}

// Günü güncelle
function updateDailyTotal(amount) {
  const key = getTodayKey();
  const existing = parseInt(localStorage.getItem(key)) || 0;
  localStorage.setItem(key, existing + amount);
}

// addWater fonksiyonuna şunu ekle:
function addWater(amount) {
  total += amount;
  updateDisplay();
  updateDailyTotal(amount); // ← Günlük veriyi güncelle
  updateChart(); // ← Grafiği yenile
}

// 📊 Grafik verisini hazırla
function getLast7DaysData() {
  const labels = [];
  const data = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const key = `water-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const dayLabel = date.toLocaleDateString('tr-TR', { weekday: 'short' });
    labels.push(dayLabel);
    data.push(parseInt(localStorage.getItem(key)) || 0);
  }

  return { labels, data };
}

// 📊 Grafik Oluştur
let chart;
function renderChart() {
  const ctx = document.getElementById("weeklyChart").getContext("2d");
  const { labels, data } = getLast7DaysData();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Günlük Su (ml)",
        data: data,
        backgroundColor: "#4caf50",
        borderRadius: 6,
      }],
    },
    options: {
      scales: {
        y: { beginAtZero: true },
      },
      plugins: {
        legend: { display: false },
      },
    },
  });
}

function updateChart() {
  const { labels, data } = getLast7DaysData();
  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  chart.update();
}

// Sayfa yüklendiğinde grafik oluştur
window.onload = () => {
  // ...önceki kodlar...
  if (savedTotal) {
    total = parseInt(savedTotal);
    updateDisplay();
  }
  renderChart(); // ← Grafik oluştur
};

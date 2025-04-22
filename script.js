let total = 0;
let dailyGoal = 2000; // Varsayılan günlük hedef

const totalDisplay = document.getElementById("total");
const toggleButton = document.getElementById("theme-toggle");
const dailyGoalInput = document.getElementById("dailyGoal"); // Hedef giriş alanı
const currentGoalDisplay = document.getElementById("currentGoal"); // Mevcut hedefi gösteren span
const progressBar = document.getElementById("progressBar"); // Progress bar elementi
const progressText = document.getElementById("progressText"); // Progress metni elementi
const setReminderTimeDisplay = document.getElementById("setReminderTime"); // Ayarlanan hatırlatma saatini gösteren span

// 🕒 Su içme hatırlatma saati kaydetme
function saveReminderTime() {
  const time = document.getElementById("reminderTime").value;
  if (time) {
    localStorage.setItem("reminderTime", time);
    setReminderTimeDisplay.textContent = time; // Ayarlanan saati göster
    alert("Hatırlatma zamanı kaydedildi: " + time);
  } else {
    alert("Lütfen bir hatırlatma saati seçin.");
  }
}

// 💧 Toplam suyu ve ilerleme çubuğunu güncelle
function updateDisplay() {
  totalDisplay.textContent = total;
  localStorage.setItem("totalWater", total);

  // İlerleme çubuğunu ve metnini güncelle
  updateProgressBar();
}

// 📈 İlerleme çubuğunu güncelle
function updateProgressBar() {
  // Hedefe göre yüzde hesapla
  const percentage = dailyGoal > 0 ? Math.min((total / dailyGoal) * 100, 100) : 0;

  progressBar.style.width = percentage + "%";
  progressText.textContent = Math.round(percentage) + "%";

  // Hedef aşıldığında çubuğun rengini değiştirmek isterseniz burada yapabilirsiniz
  if (percentage >= 100) {
    progressBar.style.backgroundColor = "#4CAF50"; // Yeşil (Hedefe ulaşıldı)
  } else {
    progressBar.style.backgroundColor = "#2196F3"; // Mavi (Hedefe henüz ulaşılmadı)
  }
}

// 💧 Su ekleme (HTML'deki butonlar doğrudan bu fonksiyonu çağıracak)
function addWater(amount) {
  total += amount;
  updateDisplay(); // Toplamı ve ilerleme çubuğunu güncelle
  updateDailyTotal(amount); // Günlük kaydı güncelle
  updateChart(); // Grafik verisini güncelle
}

// 🔁 Günlük su verisini güncelle (Mevcut fonksiyon, değişiklik yok)
function updateDailyTotal(amount) {
  const key = getTodayKey();
  const existing = parseInt(localStorage.getItem(key)) || 0;
  localStorage.setItem(key, existing + amount);
}

// 🔄 Günlük Toplamı sıfırla
function resetTotal() {
  total = 0;
  updateDisplay(); // Toplamı ve ilerleme çubuğunu güncelle
  updateDailyTotal(0 - parseInt(localStorage.getItem(getTodayKey()) || 0)); // Günlük kaydı da sıfırla
  updateChart(); // Grafik verisini güncelle
  alert("Günlük toplam su sıfırlandı.");
}

// 🎯 Günlük hedefi kaydet
function saveDailyGoal() {
  const newGoal = parseInt(dailyGoalInput.value);
  if (!isNaN(newGoal) && newGoal > 0) {
    dailyGoal = newGoal;
    localStorage.setItem("dailyGoal", dailyGoal); // Hedefi kaydet
    currentGoalDisplay.textContent = dailyGoal; // Mevcut hedefi göster
    updateProgressBar(); // Hedef değişince ilerleme çubuğunu güncelle
    alert("Günlük hedef kaydedildi: " + dailyGoal + " ml");
  } else {
    alert("Geçerli bir hedef miktarı girin.");
    dailyGoalInput.value = dailyGoal; // Geçersiz girişte eski değeri geri getir
  }
}

// 🎯 Günlük hedefi sıfırla (Varsayılan değere döndür)
function resetDailyGoal() {
  dailyGoal = 2000; // Varsayılan hedefe sıfırla
  localStorage.setItem("dailyGoal", dailyGoal); // Kaydedilmiş hedefi güncelle
  dailyGoalInput.value = dailyGoal; // Giriş alanını güncelle
  currentGoalDisplay.textContent = dailyGoal; // Mevcut hedefi göster
  updateProgressBar(); // Hedef değişince ilerleme çubuğunu güncelle
  alert("Günlük hedef varsayılana (2000 ml) sıfırlandı.");
}


// 📅 Bugünün verisini alma (Mevcut fonksiyon, değişiklik yok)
function getTodayKey() {
  const today = new Date();
  return `water-${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
}

// 📊 Haftalık veri hazırla (Mevcut fonksiyon, değişiklik yok)
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

// 📊 Grafik oluştur (Mevcut fonksiyon, değişiklik yok)
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

// 📈 Grafik güncelle (Mevcut fonksiyon, değişiklik yok)
function updateChart() {
  const { labels, data } = getLast7DaysData();
  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  chart.update();
}

// 🌙 Tema geçişi (Mevcut fonksiyon, değişiklik yok)
toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  toggleButton.textContent = isDark ? '🌞' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// 🔔 Bildirim gönderme (Mevcut fonksiyon, değişiklik yok)
function sendWaterReminder() {
  if (Notification.permission === "granted") {
    new Notification("💧 Su Zamanı!", {
      body: "Hadi bir bardak su iç! 🥤",
      icon: "icon.png" // icon.png dosyanızın varlığından emin olun
    });
  }
}

// ⏰ Kullanıcı tanımlı saat geldiğinde bildirim gönder
function checkReminderTime() {
  const savedTime = localStorage.getItem("reminderTime");
  if (!savedTime || savedTime === "") return; // Kaydedilmiş saat yoksa veya boşsa çık

  const now = new Date();
  const current = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');

  // Saniyeyi kontrol etmek, aynı dakika içinde birden çok bildirim göndermeyi önler
  if (current === savedTime && now.getSeconds() >= 0 && now.getSeconds() < 10) {
    sendWaterReminder();
  }
}
// Her 15 saniyede bir kontrol et (daha sık kontrol etmek daha doğru zamanlama sağlayabilir)
setInterval(checkReminderTime, 15 * 1000);


// 🔁 Sayfa açıldığında verileri yükle
window.onload = () => {
  // Kaydedilmiş toplam suyu yükle
  const savedTotal = localStorage.getItem("totalWater");
  if (savedTotal) {
    total = parseInt(savedTotal);
  }

  // Kaydedilmiş günlük hedefi yükle
  const savedGoal = localStorage.getItem("dailyGoal");
  if (savedGoal) {
    dailyGoal = parseInt(savedGoal);
  }
  dailyGoalInput.value = dailyGoal; // Hedef giriş alanına yüklenen değeri yaz
  currentGoalDisplay.textContent = dailyGoal; // Mevcut hedefi göster

  // Ekranı ilk yüklemede güncelle (Toplam su ve ilerleme çubuğu)
  updateDisplay();

  // Kaydedilmiş temayı yükle
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    toggleButton.textContent = '🌞';
  }

  // Bildirim izni iste (Zaten HTML içinde de var, burada tekrar olması zarar vermez)
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  // Grafik render et
  renderChart();

  // Kaydedilmiş hatırlatma saatini göster
  const savedReminderTime = localStorage.getItem("reminderTime");
  if (savedReminderTime) {
    document.getElementById("reminderTime").value = savedReminderTime;
    setReminderTimeDisplay.textContent = savedReminderTime;
  } else {
    setReminderTimeDisplay.textContent = "-";
  }
};

// 📲 Service Worker ile mobil bildirim desteği (Mevcut kod, değişiklik yok)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(reg => console.log("✅ Service Worker kayıtlı:", reg))
    .catch(err => console.error("❌ SW hatası:", err));
}
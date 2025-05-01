let total = 0;
let dailyGoal = 2000; // Varsayılan hedef

const motivationalMessages = [
    "Harika gidiyorsun! 💖",
    "Su içmeyi unutma tatlım! 💕",
    "Sağlıklı ve güzel bir gün geçirmen dileğiyle! 🌸",
    "Her bardak su, daha sağlıklı bir sen demek! ✨",
    "Günlük hedefine yaklaşıyorsun! 🎯",
    "Su içmek cildini güzelleştirir! 💫"
];

const totalDisplay = document.getElementById("total");
const dailyGoalInput = document.getElementById("dailyGoal");
const currentGoalDisplay = document.getElementById("currentGoal");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const setReminderTimeDisplay = document.getElementById("setReminderTime");

let weeklyData = [0, 0, 0, 0, 0, 0, 0];

function saveReminderTime() {
  const reminderTime = document.getElementById('reminderTime').value;
  document.getElementById('setReminderTime').textContent = reminderTime || '-';
  alert('Hatırlatma saati kaydedildi: ' + reminderTime);
}

function addWater(amount) {
    total += amount;
    updateDisplay();
    showMotivationalMessage();
    checkGoal();
    saveProgress();

    const today = new Date().getDay();
    weeklyData[today] += amount;
    updateWeeklyChart();
}

function resetTotal() {
    total = 0;
    updateDisplay();
    saveProgress();
    showMotivationalMessage();
}

function saveDailyGoal() {
    const newGoal = parseInt(document.getElementById('dailyGoalInput').value);
    if (newGoal >= 500) {
        dailyGoal = newGoal;
        localStorage.setItem('dailyGoal', dailyGoal);
        document.getElementById('currentGoal').textContent = dailyGoal;
        updateDisplay();
        showToast('Yeni hedefin kaydedildi! 🎯');
    } else {
        showToast('Lütfen en az 500ml bir hedef belirle! 💦');
    }
}

// Toast bildirimi gösterme fonksiyonu
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function resetDailyGoal() {
  dailyGoal = 2000;
  dailyGoalInput.value = dailyGoal;
  currentGoalDisplay.textContent = dailyGoal;
  updateDisplay();
}

function updateDisplay() {
    totalDisplay.textContent = total;
    const percentage = Math.min((total / dailyGoal) * 100, 100);
    progressBar.style.width = percentage + "%";
    progressText.textContent = Math.round(percentage) + "%";
}

function updateWeeklyChart() {
  weeklyChart.data.datasets[0].data = weeklyData;
  weeklyChart.update();
}

function showMotivationalMessage() {
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    document.getElementById("motivationMessage").textContent = randomMessage;
}

function checkGoal() {
    if (total >= dailyGoal) {
        showNotification("Günlük hedefine ulaştın! Harikasın! 🎉");
    }
}

function saveProgress() {
    localStorage.setItem('waterTotal', total);
}

function loadProgress() {
    const savedTotal = localStorage.getItem('waterTotal');
    if (savedTotal) {
        total = parseInt(savedTotal);
        updateDisplay();
    }
}

const ctx = document.getElementById('weeklyChart').getContext('2d');
const weeklyChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
    datasets: [{
      label: 'İçilen Su (ml)',
      data: [500, 1000, 1500, 2000, 1800, 2200, 2500],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

const ctxDaily = document.getElementById('dailyChart').getContext('2d');
const dailyChart = new Chart(ctxDaily, {
  type: 'line',
  data: {
    labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
    datasets: [{
      label: 'İçilen Su (ml)',
      data: [250, 500, 750, 1000, 1250, 1500, 1750],
      borderColor: '#4caf50',
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      borderWidth: 2,
      fill: true
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

function scheduleNotification(time) {
  const now = new Date();
  const delay = new Date(time) - now;

  if (delay > 0) {
    setTimeout(() => {
      navigator.serviceWorker.ready.then(function(registration) {
        registration.showNotification('💧 Su Zamanı!', {
          body: 'Su içme zamanı geldi!',
          icon: 'icon.png',
          badge: 'icon.png'
        });
      });
    }, delay);
  }
}

function saveUserName() {
  const userName = document.getElementById('userName').value;
  localStorage.setItem('userName', userName);
  document.getElementById('greetingName').textContent = userName || 'Kullanıcı';
}

// Sayfa yüklendiğinde kullanıcı adını kontrol et
window.addEventListener('load', function() {
  const savedName = localStorage.getItem('userName');
  if (savedName) {
    document.getElementById('greetingName').textContent = savedName;
  }
});

function toggleDarkMode() {
    const body = document.documentElement;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const themeButton = document.getElementById('theme-toggle');
    themeButton.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    
    showToast(newTheme === 'dark' ? 'Karanlık mod aktif 🌙' : 'Aydınlık mod aktif ☀️');
}

// Sayfa yüklendiğinde tema durumunu kontrol et
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.getElementById('theme-toggle').textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
});

document.getElementById('theme-toggle').addEventListener('click', function () {
  toggleDarkMode();
});

// Sayfa yüklendiğinde
window.addEventListener('load', () => {
    const savedGoal = localStorage.getItem('dailyGoal');
    if (savedGoal) {
        dailyGoal = parseInt(savedGoal);
        document.getElementById('dailyGoalInput').value = dailyGoal;
        document.getElementById('currentGoal').textContent = dailyGoal;
    }
    loadProgress();
    showMotivationalMessage();
    
    // Bildirim izni iste
    if ('Notification' in window) {
        Notification.requestPermission();
    }
});

// Her saat başı hatırlatma
setInterval(() => {
    if (Notification.permission === "granted") {
        new Notification("Su İçme Zamanı! 💕", {
            body: "Biraz su içmeye ne dersin?",
            icon: "water-icon.png"
        });
    }
}, 3600000); // Her saat (3600000 ms)
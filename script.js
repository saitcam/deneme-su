let total = 0;
let dailyGoal = 2000;

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

  const today = new Date().getDay();
  weeklyData[today] += amount;
  updateWeeklyChart();
}

function resetTotal() {
  total = 0;
  updateDisplay();
}

function saveDailyGoal() {
  dailyGoal = parseInt(dailyGoalInput.value) || 2000;
  currentGoalDisplay.textContent = dailyGoal;
  updateDisplay();
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

const ctx = document.getElementById('weeklyChart').getContext('2d');
const weeklyChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
    datasets: [{
      label: 'İçilen Su (ml)',
      data: [500, 1000, 1500, 2000, 1800, 2200, 2500],
      backgroundColor: [
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 99, 132, 0.2)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 99, 132, 1)'
      ],
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

document.getElementById('theme-toggle').addEventListener('click', function () {
  document.body.classList.toggle('dark-theme');
  const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
});

// Sayfa yüklendiğinde tema durumunu kontrol et
window.addEventListener('load', function () {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
});
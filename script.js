let count = 0;
const defaultGoal = 2000;
let goal = defaultGoal;

window.addEventListener('load', () => {
  // Hedefi yükle veya varsayılan ata
  const storedGoal = localStorage.getItem('dailyGoal');
  goal = storedGoal ? Number(storedGoal) : defaultGoal;
  localStorage.setItem('dailyGoal', goal);

  // Input ve ekranda göster
  document.getElementById('goalInput').value = goal;
  document.getElementById('goalDisplay').innerText = goal;

  // Su miktarını yükle
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

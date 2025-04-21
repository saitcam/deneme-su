let count = 0;
<<<<<<< HEAD
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
=======
let goal = 2000;  // Varsayılan değer, localStorage’dan okunacak

// DOM elemanları
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const goalInput = document.getElementById("goalInput");
const saveGoalBtn = document.getElementById("saveGoalBtn");

// Uygulama başında çalışacak
window.onload = () => {
  // Kaydedilmiş hedef var mı?
  const storedGoal = localStorage.getItem("dailyGoal");
  if (storedGoal) goal = Number(storedGoal);
  goalInput.value = goal;

  // Kaydedilmiş içim miktarı
  const storedWater = localStorage.getItem("water");
  if (storedWater) count = Number(storedWater);

  updateDisplay();
};

// Su ekleme fonksiyonu
function addWater(amount) {
  count += amount;
  if (count > goal) count = goal;
  localStorage.setItem("water", count);
  updateDisplay();
}

// Sayaç sıfırlama
function resetCounter() {
  count = 0;
  localStorage.setItem("water", count);
  updateDisplay();
}

// Hedef kaydetme
saveGoalBtn.addEventListener("click", () => {
  const newGoal = Number(goalInput.value) || 0;
  if (newGoal > 0) {
    goal = newGoal;
    localStorage.setItem("dailyGoal", goal);
    // Eğer mevcut sayaç yeni hedeften büyükse resetle
    if (count > goal) count = goal;
    localStorage.setItem("water", count);
    updateDisplay();
    alert(`Günlük hedefiniz ${goal} ml olarak kaydedildi.`);
  }
});

// Ekranı güncelle
function updateDisplay() {
  const percent = goal > 0 ? (count / goal) * 100 : 0;
  progressBar.style.width = percent + "%";
  progressText.textContent = `${count} / ${goal} ml`;
>>>>>>> 0e3d62fd6dc926ce18e30aa7d53ef9caedae3b13
}

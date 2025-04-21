let count = 0;
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
}

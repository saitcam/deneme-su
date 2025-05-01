let total = 0;
let dailyGoal = 2000;

const motivationalMessages = [
    "Günaydın Seray'cım! Yeni bir güne başlıyoruz 🌸",
    "Su içmeyi unutma tatlım! 💖",
    "Günlük hedefine yaklaşıyorsun, harikasın! ✨",
    "Kendine iyi baktığın için çok mutluyum 💝",
    "Su içmek cildini güzelleştirir! 💫",
    "Sağlıklı bir yaşam için su çok önemli! 🌊",
    "Bugün kendine iyi bak Seray'cım! 🎀"
];

// DOM elementlerini seç
const totalDisplay = document.getElementById("total");
const dailyGoalInput = document.getElementById("dailyGoalInput");
const currentGoalDisplay = document.getElementById("currentGoal");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const motivationMessage = document.getElementById("motivationMessage");

// Su ekleme fonksiyonu
function addWater(amount) {
    total += amount;
    updateDisplay();
    createWaterDropAnimation();
    showRandomMotivation();
    saveProgress();
}

// Ekranı güncelle
function updateDisplay() {
    totalDisplay.textContent = total;
    const percentage = Math.min((total / dailyGoal) * 100, 100);
    progressBar.style.width = percentage + "%";
    progressText.textContent = Math.round(percentage) + "%";
}

// Su damlası animasyonu
function createWaterDropAnimation() {
    const drop = document.createElement('div');
    drop.className = 'water-drop';
    drop.innerHTML = '💧';
    drop.style.fontSize = '40px';
    drop.style.left = `${Math.random() * window.innerWidth}px`;
    document.body.appendChild(drop);

    setTimeout(() => {
        drop.remove();
    }, 1000);
}

// Rastgele motivasyon mesajı
function showRandomMotivation() {
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    motivationMessage.textContent = motivationalMessages[randomIndex];
}

// Hedefi kaydet
function saveDailyGoal() {
    const newGoal = parseInt(dailyGoalInput.value);
    if (newGoal >= 500) {
        dailyGoal = newGoal;
        currentGoalDisplay.textContent = dailyGoal;
        updateDisplay();
        localStorage.setItem('dailyGoal', dailyGoal);
        showToast('Yeni hedefin kaydedildi! 🎯');
    } else {
        showToast('Lütfen en az 500ml bir hedef belirle! 💦');
    }
}

// Toast bildirimi göster
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// İlerlemeyi kaydet
function saveProgress() {
    localStorage.setItem('waterTotal', total);
}

// İlerlemeyi yükle
function loadProgress() {
    const savedTotal = localStorage.getItem('waterTotal');
    const savedGoal = localStorage.getItem('dailyGoal');
    
    if (savedTotal) {
        total = parseInt(savedTotal);
        updateDisplay();
    }
    
    if (savedGoal) {
        dailyGoal = parseInt(savedGoal);
        dailyGoalInput.value = dailyGoal;
        currentGoalDisplay.textContent = dailyGoal;
    }
}

// Günlük toplamı sıfırla
function resetTotal() {
    total = 0;
    updateDisplay();
    saveProgress();
    showToast('Günlük toplam sıfırlandı! 🔄');
}

// Sayfa yüklendiğinde
window.addEventListener('load', () => {
    loadProgress();
    showRandomMotivation();
});

// Her gece yarısı toplamı sıfırla
function checkDayReset() {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        resetTotal();
    }
}

setInterval(checkDayReset, 60000); // Her dakika kontrol et
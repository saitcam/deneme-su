// Firebase yapılandırmasını script.js'in en üstüne taşıyalım
const database = firebase.database();

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

// Günlük hedefi kaydet
function setDailyGoal(goal) {
    return firebase.database().ref('settings/dailyGoal').set(goal);
}

// Günlük hedefi oku
function getDailyGoal() {
    return firebase.database().ref('settings/dailyGoal').once('value')
        .then(snapshot => snapshot.val() || 2000); // varsayılan 2000ml
}

// Hedefi dinle ve değişiklikleri takip et
function listenDailyGoal() {
    firebase.database().ref('settings/dailyGoal').on('value', snapshot => {
        const goal = snapshot.val() || 2000;
        document.getElementById('currentGoal').textContent = goal;
        // İlerleme çubuklarını güncelle
        updateAllProgress();
    });
}

// Su ekleme fonksiyonu - Firebase ile uyumlu
function addWater(amount = 200, user = "seray") {
    const today = new Date().toISOString().slice(0, 10);
    const userRef = database.ref(`users/${user}/${today}`);
    userRef.transaction((currentTotal) => {
        return (currentTotal || 0) + amount;
    });
    showToast("Su eklendi!");
    showWaterDropAnimation();
}

// İlerleme çubuğunu güncelle
function updateProgress(user, total) {
    const percentage = Math.min((total / dailyGoal) * 100, 100);
    const progressBar = document.getElementById(`${user}-progress`);
    const progressText = document.getElementById(`${user}-progress-text`);
    if (progressBar && progressText) {
        progressBar.style.width = percentage + '%';
        progressText.textContent = Math.round(percentage) + '%';
    }
}

// Tüm ilerleme çubuklarını güncelle
function updateAllProgress() {
    const today = new Date().toISOString().slice(0, 10);
    ['seray', 'sait'].forEach(user => {
        database.ref(`users/${user}/${today}`).once('value', (snapshot) => {
            const total = snapshot.val() || 0;
            updateProgress(user, total);
        });
    });
}

// Su damlası animasyonu
function showWaterDropAnimation() {
    const drop = document.createElement('div');
    drop.className = 'water-drop-anim';
    drop.textContent = '💧';
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

// Hedefi kaydet - Firebase ile
function saveDailyGoal() {
    const newGoal = parseInt(dailyGoalInput.value);
    if (newGoal >= 500) {
        dailyGoal = newGoal;
        setDailyGoal(dailyGoal);
        currentGoalDisplay.textContent = dailyGoal;
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

// Sıfırlama fonksiyonu - Firebase ile
function resetTotal(user = "seray") {
    const today = new Date().toISOString().slice(0, 10);
    database.ref(`users/${user}/${today}`).set(0)
        .then(() => {
            showToast(`${user}'ın su tüketimi sıfırlandı! 🔄`);
        })
        .catch(error => {
            console.error('Sıfırlama hatası:', error);
            showToast('Bir hata oluştu!');
        });
}

// Verileri dinleme - Firebase Realtime
function listenToWaterData() {
    const today = new Date().toISOString().slice(0, 10);
    ['seray', 'sait'].forEach(user => {
        database.ref(`users/${user}/${today}`).on('value', (snapshot) => {
            const total = snapshot.val() || 0;
            const totalDisplay = document.getElementById(`${user}-total`);
            if (totalDisplay) {
                totalDisplay.textContent = total;
                updateProgress(user, total);
            }
        });
    });
}

// Sayfa yüklendiğinde
window.addEventListener('load', () => {
    // Firebase'den hedefi yükle
    getDailyGoal().then(goal => {
        dailyGoal = goal;
        dailyGoalInput.value = dailyGoal;
        currentGoalDisplay.textContent = dailyGoal;
    });
    listenToWaterData();
    listenDailyGoal();
    showRandomMotivation();
    // Eğer kullanıcı daha önce tema seçmediyse, sistem temasını uygula
    if (!localStorage.getItem('theme')) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.getElementById('theme-toggle').textContent = '☀️';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            document.getElementById('theme-toggle').textContent = '🌙';
        }
    }
    autoDarkModeByTime();
    setInterval(autoDarkModeByTime, 60 * 60 * 1000); // Her saat başı kontrol
    checkDayReset(); // Sayfa yüklenince kontrol et
    loadFriends(); // Sayfa yüklenince arkadaş listesini göster
});

// Son gösterilen tarihi localStorage'da tut
function checkDayReset() {
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = localStorage.getItem('lastDate');
    if (lastDate !== today) {
        localStorage.setItem('lastDate', today);
        // Ekrandaki toplamları sıfırla
        document.getElementById('seray-total').textContent = '0';
        document.getElementById('sait-total').textContent = '0';
        document.getElementById('seray-progress').style.width = '0%';
        document.getElementById('seray-progress-text').textContent = '0%';
        document.getElementById('sait-progress').style.width = '0%';
        document.getElementById('sait-progress-text').textContent = '0%';
    }
}

// Her dakika kontrol et
setInterval(checkDayReset, 60000);

function toggleDarkMode() {
    const body = document.documentElement;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    document.getElementById('theme-toggle').textContent = newTheme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('themeSelected', 'true');
}

// Otomatik geçişte kontrol:
function autoDarkModeByTime() {
    if (localStorage.getItem('themeSelected') === 'true') return;
    const hour = new Date().getHours();
    if (hour >= 20 || hour < 7) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('theme-toggle').textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.getElementById('theme-toggle').textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

// Bildirim izni isteme
function requestNotificationPermission() {
    if ('Notification' in window) {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
}
document.addEventListener('DOMContentLoaded', requestNotificationPermission);

function showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body: body });
    }
}

// script.js dosyanın uygun bir yerine ekle
function startWaterReminder(intervalMinutes = 120) {
    // Önce varsa eski hatırlatıcıyı temizle
    if (window.waterReminderInterval) {
        clearInterval(window.waterReminderInterval);
    }
    // Yeni hatırlatıcıyı başlat
    window.waterReminderInterval = setInterval(() => {
        showNotification('Su İçme Zamanı!', 'Sağlığın için bir bardak su içmeyi unutma 💧');
    }, intervalMinutes * 60 * 1000);
}

// Sayfa yüklenince otomatik başlatmak için:
document.addEventListener('DOMContentLoaded', () => {
    startWaterReminder(120); // 120 dakika (2 saat) aralıkla hatırlatır
});

function startCustomWaterReminder() {
    const intervalInput = document.getElementById('reminder-interval');
    let interval = parseInt(intervalInput.value, 10);
    if (isNaN(interval) || interval < 10) interval = 120; // minimum 10 dakika
    startWaterReminder(interval);
}

function addFriend() {
    const currentUser = "seray"; // Giriş yapan kullanıcıya göre dinamik yapabilirsin
    const friendUsername = document.getElementById('friend-username').value.trim();
    if (!friendUsername) {
        showToast("Arkadaş kullanıcı adı giriniz!");
        return;
    }
    if (friendUsername === currentUser) {
        showToast("Kendinizi arkadaş olarak ekleyemezsiniz!");
        return;
    }
    // Arkadaş olarak ekle
    database.ref(`users/${currentUser}/friends/${friendUsername}`).set(true)
        .then(() => {
            showToast("Arkadaş eklendi!");
            loadFriends();
        })
        .catch(() => showToast("Bir hata oluştu!"));
}

// Arkadaş listesini yükle ve karşılaştırma yap
function loadFriends() {
    const currentUser = "seray"; // Giriş yapan kullanıcıya göre dinamik yapabilirsin
    const today = new Date().toISOString().slice(0, 10);
    const friendListDiv = document.getElementById('friend-list');
    friendListDiv.innerHTML = "<b>Arkadaşlar:</b><br>";

    database.ref(`users/${currentUser}/friends`).once('value', snapshot => {
        const friends = snapshot.val();
        if (!friends) {
            friendListDiv.innerHTML += "Henüz arkadaş yok.";
            return;
        }
        // Önce eski dinleyicileri temizle
        if (window.friendListeners) {
            window.friendListeners.forEach(unsub => unsub());
        }
        window.friendListeners = [];

        Object.keys(friends).forEach(friend => {
            const friendRef = database.ref(`users/${friend}/${today}`);
            // Her arkadaş için dinamik dinleyici ekle
            const listener = friendRef.on('value', snap => {
                const total = snap.val() || 0;
                let friendElem = document.getElementById(`friend-${friend}`);
                if (!friendElem) {
                    friendElem = document.createElement('div');
                    friendElem.id = `friend-${friend}`;
                    friendListDiv.appendChild(friendElem);
                }
                friendElem.textContent = `${friend}: ${total} ml`;
            });
            // Dinleyiciyi daha sonra kaldırmak için sakla
            window.friendListeners.push(() => friendRef.off('value', listener));
        });
    });
}

// Sayfa yüklenince arkadaş listesini göster
window.addEventListener('load', loadFriends);
// Данные игр
let gamesData = [];

// ССЫЛКА НА ВАШ JSON ФАЙЛ
const GAMES_JSON_URL = 'https://raw.githubusercontent.com/Lizurchyk/Mini-app/refs/heads/main/games.json';

// ID ваших Telegram каналов
const REQUIRED_CHANNELS = [
    '@SimpleDLC'
];

// Элементы DOM
let subscriptionCheck, mainContent, checkResult;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', async function() {
    await initializeApp();
});

// Основная функция инициализации
async function initializeApp() {
    subscriptionCheck = document.getElementById('subscriptionCheck');
    mainContent = document.getElementById('mainContent');
    checkResult = document.getElementById('checkResult');
    
    // Проверяем, запущено ли в Telegram
    if (window.Telegram && window.Telegram.WebApp) {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        
        // Используем метод Telegram Mini Apps для проверки подписки
        await checkSubscriptionWithTelegram();
    } else {
        // Если не в Telegram, используем fallback проверку
        await checkSubscriptionFallback();
    }
}

// Проверка подписки через Telegram Mini Apps
async function checkSubscriptionWithTelegram() {
    try {
        showLoading('Проверка подписки...');
        
        const user = Telegram.WebApp.initDataUnsafe.user;
        if (!user) {
            throw new Error('Не удалось получить данные пользователя');
        }
        
        // Пытаемся использовать Telegram Mini Apps API для проверки
        const isSubscribed = await checkViaTelegramMiniApps();
        
        if (isSubscribed) {
            showMainContent();
        } else {
            showSubscriptionRequired();
        }
        
    } catch (error) {
        console.error('Ошибка проверки через Telegram:', error);
        // Fallback на обычную проверку
        await checkSubscriptionFallback();
    }
}

// Проверка через Telegram Mini Apps (используем встроенные методы)
async function checkViaTelegramMiniApps() {
    return new Promise((resolve) => {
        // В реальном Mini App можно использовать различные методы
        // Например, проверка через открытие канала и возврат результата
        
        // Временная реализация - всегда true для демонстрации
        // На практике вам нужно будет реализовать свою логику проверки
        
        setTimeout(() => {
            // Здесь может быть ваша кастомная логика проверки
            // Например, через открытие канала и проверку возврата
            resolve(true);
        }, 1000);
    });
}

// Fallback проверка подписки (без сервера)
async function checkSubscriptionFallback() {
    showLoading('Проверка доступа...');
    
    // Простая проверка без сервера
    // Можно использовать localStorage для запоминания проверки
    const previouslyVerified = localStorage.getItem('subscriptionVerified');
    
    if (previouslyVerified === 'true') {
        showMainContent();
        return;
    }
    
    // Показываем экран проверки подписки
    showSubscriptionScreen();
}

// Показать экран проверки подписки
function showSubscriptionScreen() {
    let html = `
        <div class="subscription-screen">
            <div class="subscription-icon">
                <i class="fab fa-telegram"></i>
            </div>
            <h2>Требуется подписка</h2>
            <p>Для доступа к контенту необходимо подписаться на наш Telegram канал</p>
            
            <div class="channels-required">
                <div class="channel-card">
                    <strong>@SimpleDLC</strong>
                    <p>Основной канал с играми и модами</p>
                </div>
            </div>
            
            <div class="verification-steps">
                <h4>Как получить доступ:</h4>
                <div class="step">
                    <span class="step-number">1</span>
                    <span>Подпишитесь на канал @SimpleDLC</span>
                </div>
                <div class="step">
                    <span class="step-number">2</span>
                    <span>Вернитесь в это приложение</span>
                </div>
                <div class="step">
                    <span class="step-number">3</span>
                    <span>Нажмите "Я подписался"</span>
                </div>
            </div>
            
            <div class="subscription-buttons">
                <a href="https://t.me/SimpleDLC" target="_blank" class="subscribe-btn">
                    <i class="fab fa-telegram"></i> Перейти в канал
                </a>
                <button onclick="verifySubscription()" class="verify-btn">
                    <i class="fas fa-check"></i> Я подписался
                </button>
            </div>
            
            <div class="subscription-note">
                <small>После подписки возвращайтесь и нажимайте "Я подписался"</small>
            </div>
        </div>
    `;
    
    showCheckResult('info', html);
}

// Верификация подписки (когда пользователь говорит что подписался)
function verifySubscription() {
    // Сохраняем в localStorage что пользователь прошел проверку
    localStorage.setItem('subscriptionVerified', 'true');
    
    showCheckResult('success', `
        <div class="verification-success">
            <i class="fas fa-check-circle"></i>
            <h3>Доступ открыт!</h3>
            <p>Подписка подтверждена. Наслаждайтесь контентом!</p>
        </div>
    `);
    
    setTimeout(() => {
        showMainContent();
    }, 2000);
}

// Показать что подписка требуется (для Telegram)
function showSubscriptionRequired() {
    let html = `
        <div class="telegram-subscription">
            <div class="tg-icon">
                <i class="fab fa-telegram"></i>
            </div>
            <h2>Подписка требуется</h2>
            <p>Для доступа к приложению необходимо быть подписанным на наш канал</p>
            
            <div class="tg-channel">
                <strong>@SimpleDLC</strong>
            </div>
            
            <div class="tg-buttons">
                <button onclick="Telegram.WebApp.openTelegramLink('https://t.me/SimpleDLC')" class="tg-subscribe-btn">
                    <i class="fab fa-telegram"></i> Подписаться
                </button>
                <button onclick="retryTelegramCheck()" class="tg-retry-btn">
                    <i class="fas fa-sync-alt"></i> Проверить снова
                </button>
            </div>
        </div>
    `;
    
    showCheckResult('error', html);
}

// Повторная проверка для Telegram
function retryTelegramCheck() {
    checkSubscriptionWithTelegram();
}

// Показать загрузку
function showLoading(message) {
    if (checkResult) {
        checkResult.className = 'check-result loading';
        checkResult.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <span>${message}</span>
            </div>
        `;
        checkResult.style.display = 'block';
    }
}

// Показать результат проверки
function showCheckResult(type, message) {
    if (checkResult) {
        checkResult.className = `check-result ${type}`;
        checkResult.innerHTML = message;
        checkResult.style.display = 'block';
    }
}

// Показать основной контент
function showMainContent() {
    if (subscriptionCheck) subscriptionCheck.classList.add('hidden');
    if (mainContent) mainContent.classList.remove('hidden');
    
    setupTheme();
    loadGames();
    setupSearch();
}

// ==================== ОСНОВНЫЕ ФУНКЦИИ САЙТА ====================

// Загрузка данных игр
async function loadGames() {
    const container = document.getElementById('gamesContainer');
    if (!container) return;
    
    try {
        container.innerHTML = '<div class="loading">Загрузка игр...</div>';
        
        const response = await fetch(GAMES_JSON_URL);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        
        gamesData = await response.json();
        displayGames(gamesData);
        
    } catch (error) {
        console.error('Ошибка загрузки игр:', error);
        container.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Ошибка загрузки</h3>
                <p>${error.message}</p>
                <button onclick="loadGames()" class="retry-btn">
                    <i class="fas fa-redo"></i> Попробовать снова
                </button>
            </div>
        `;
    }
}

// Отображение карточек игр
function displayGames(games) {
    const container = document.getElementById('gamesContainer');
    if (!container) return;
    
    if (!games || games.length === 0) {
        container.innerHTML = '<div class="no-results">Игры не найдены</div>';
        return;
    }

    container.innerHTML = games.map(game => `
        <div class="game-card" data-id="${game.id}">
            <img src="${game.image}" alt="${game.name}" class="game-image" 
                 onerror="this.src='https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=250&fit=crop'">
            <div class="game-info">
                <h3 class="game-title">${game.name}</h3>
                <div class="game-description">${formatDescription(game.description)}</div>
                <div class="game-meta">
                    <span class="game-version">Версия: ${game.version}</span>
                </div>
                <a href="${game.link}" class="game-link" onclick="handleDownload(event, ${game.id})">
                    <i class="fas fa-download"></i> Установить
                </a>
            </div>
        </div>
    `).join('');
}

// Обработчик скачивания
function handleDownload(event, gameId) {
    event.preventDefault();
    const link = event.target.href || event.target.parentElement.href;
    
    // Можно добавить логику перед скачиванием
    console.log(`Скачивание игры ID: ${gameId}`);
    
    // Открываем ссылку
    window.open(link, '_blank');
}

// Форматирование описания
function formatDescription(description) {
    if (Array.isArray(description)) {
        return description.join('<br><br>');
    }
    if (typeof description === 'string') {
        return description.replace(/\n/g, '<br>');
    }
    return description;
}

// Поиск игр
function searchGames(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
        displayGames(gamesData);
        return;
    }

    const filteredGames = gamesData.filter(game => 
        game.name.toLowerCase().includes(searchTerm) ||
        game.description.toLowerCase().includes(searchTerm)
    );

    displayGames(filteredGames);
}

// Настройка поиска
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchGames(this.value);
        }, 300);
    });
}

// Управление темой
function setupTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    if (!themeToggle) return;

    // Используем тему Telegram если доступно
    if (window.Telegram && window.Telegram.WebApp) {
        const tgTheme = Telegram.WebApp.colorScheme;
        if (tgTheme === 'dark') {
            body.classList.add('dark-theme');
            themeToggle.checked = true;
        }
    }

    // Переключение темы
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Глобальные функции
window.verifySubscription = verifySubscription;
window.retryTelegramCheck = retryTelegramCheck;
window.loadGames = loadGames;
window.handleDownload = handleDownload;

// Сброс проверки подписки (для тестирования)
window.resetSubscription = function() {
    localStorage.removeItem('subscriptionVerified');
    window.location.reload();
};

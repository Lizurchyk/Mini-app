// Данные игр
let gamesData = [];

// ССЫЛКА НА ВАШ JSON ФАЙЛ
const GAMES_JSON_URL = 'https://raw.githubusercontent.com/Lizurchyk/Mini-app/refs/heads/main/games.json';

// ID вашего канала (без @)
const TELEGRAM_CHANNEL = 'SimpleDLC';

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
    
    // Проверяем, запущено ли в Telegram Mini App
    if (isTelegramWebApp()) {
        await initializeTelegramApp();
    } else {
        showNotInTelegramError();
    }
}

// Проверка что это Telegram Web App
function isTelegramWebApp() {
    return window.Telegram && window.Telegram.WebApp;
}

// Инициализация Telegram App
async function initializeTelegramApp() {
    try {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        
        // Показываем информацию о пользователе
        showUserInfo();
        
        // Начинаем проверку подписки
        await checkSubscription();
        
    } catch (error) {
        console.error('Ошибка инициализации Telegram App:', error);
        showCheckResult('error', 'Ошибка инициализации приложения');
    }
}

// Показать информацию о пользователе
function showUserInfo() {
    const user = Telegram.WebApp.initDataUnsafe.user;
    if (user) {
        console.log('User ID:', user.id);
        console.log('Username:', user.username);
        console.log('First Name:', user.first_name);
        
        // Можно показать приветствие
        const welcomeElement = document.getElementById('welcomeMessage');
        if (welcomeElement) {
            welcomeElement.textContent = `Привет, ${user.first_name || 'друг'}!`;
        }
    }
}

// Проверка подписки
async function checkSubscription() {
    showLoading('Проверяем подписку...');
    
    try {
        const user = Telegram.WebApp.initDataUnsafe.user;
        if (!user) {
            throw new Error('Не удалось получить данные пользователя');
        }
        
        // Используем метод Telegram Web App для проверки подписки
        const isSubscribed = await checkTelegramSubscription(user.id);
        
        if (isSubscribed) {
            showMainContent();
        } else {
            showSubscriptionRequired();
        }
        
    } catch (error) {
        console.error('Ошибка проверки подписки:', error);
        showCheckResult('error', `Ошибка: ${error.message}`);
    }
}

// Проверка подписки через Telegram Web App
async function checkTelegramSubscription(userId) {
    return new Promise((resolve, reject) => {
        // Этот метод работает только если бот добавлен в канал как администратор
        // и имеет права на проверку участников
        
        // Создаем временную кнопку для проверки подписки
        const checkButton = {
            type: 'check_subscription',
            subscription_id: TELEGRAM_CHANNEL,
            payload: JSON.stringify({ user_id: userId })
        };
        
        // Пытаемся использовать Telegram Web App метод
        if (Telegram.WebApp.checkSubscription) {
            Telegram.WebApp.checkSubscription(checkButton, (result) => {
                console.log('Subscription check result:', result);
                resolve(result === true);
            });
        } else {
            // Если метод не доступен, используем альтернативный способ
            checkSubscriptionAlternative(userId).then(resolve).catch(reject);
        }
    });
}

// Альтернативный способ проверки подписки
async function checkSubscriptionAlternative(userId) {
    // Этот метод использует открытие канала и проверку возврата
    return new Promise((resolve) => {
        // Показываем кнопку для ручной проверки
        showManualCheckButton(resolve);
    });
}

// Показать кнопку для ручной проверки
function showManualCheckButton(resolveCallback) {
    const html = `
        <div class="manual-check">
            <h3><i class="fab fa-telegram"></i> Проверка подписки</h3>
            <p>Нажмите кнопку ниже чтобы проверить подписку на канал @${TELEGRAM_CHANNEL}</p>
            
            <button onclick="openChannelForCheck()" class="check-channel-btn">
                <i class="fab fa-telegram"></i> Проверить подписку
            </button>
            
            <div class="manual-steps">
                <p><strong>Как проверить:</strong></p>
                <ol>
                    <li>Нажмите "Проверить подписку"</li>
                    <li>Откроется канал @${TELEGRAM_CHANNEL}</li>
                    <li>Если вы подписаны - вернитесь в приложение</li>
                    <li>Нажмите "Я подписан" ниже</li>
                </ol>
            </div>
            
            <button onclick="confirmSubscription(true, resolveCallback)" class="confirm-btn success">
                <i class="fas fa-check"></i> Я подписан
            </button>
            
            <button onclick="confirmSubscription(false, resolveCallback)" class="confirm-btn error">
                <i class="fas fa-times"></i> Я не подписан
            </button>
        </div>
    `;
    
    // Сохраняем callback в глобальной переменной
    window.currentResolveCallback = resolveCallback;
    
    showCheckResult('info', html);
}

// Открыть канал для проверки
function openChannelForCheck() {
    if (Telegram.WebApp.openTelegramLink) {
        Telegram.WebApp.openTelegramLink(`https://t.me/${TELEGRAM_CHANNEL}`);
    } else {
        window.open(`https://t.me/${TELEGRAM_CHANNEL}`, '_blank');
    }
}

// Подтверждение подписки
function confirmSubscription(isSubscribed, resolveCallback) {
    if (resolveCallback) {
        resolveCallback(isSubscribed);
    } else if (window.currentResolveCallback) {
        window.currentResolveCallback(isSubscribed);
    }
    
    if (isSubscribed) {
        showMainContent();
    } else {
        showSubscriptionRequired();
    }
}

// Показать что подписка требуется
function showSubscriptionRequired() {
    const html = `
        <div class="subscription-required">
            <div class="required-icon">
                <i class="fas fa-lock"></i>
            </div>
            
            <h2>Требуется подписка</h2>
            
            <p>Для доступа к приложению необходимо быть подписанным на наш Telegram канал</p>
            
            <div class="channel-info">
                <div class="channel-card">
                    <strong>@${TELEGRAM_CHANNEL}</strong>
                    <span>Основной канал с играми</span>
                </div>
            </div>
            
            <div class="action-buttons">
                <button onclick="openChannelAndCheck()" class="primary-btn">
                    <i class="fab fa-telegram"></i> Подписаться и проверить
                </button>
                
                <button onclick="retrySubscriptionCheck()" class="secondary-btn">
                    <i class="fas fa-sync-alt"></i> Проверить снова
                </button>
            </div>
            
            <div class="help-text">
                <small>После подписки вернитесь и нажмите "Проверить снова"</small>
            </div>
        </div>
    `;
    
    showCheckResult('error', html);
}

// Открыть канал и начать проверку
function openChannelAndCheck() {
    openChannelForCheck();
    
    // Показываем сообщение с инструкцией
    setTimeout(() => {
        showCheckResult('info', `
            <div class="instruction">
                <h4><i class="fas fa-info-circle"></i> Инструкция</h4>
                <p>Канал открыт. После подписки:</p>
                <ol>
                    <li>Вернитесь в это приложение</li>
                    <li>Нажмите "Проверить снова"</li>
                    <li>Если вы подписаны - доступ будет открыт</li>
                </ol>
            </div>
        `);
    }, 1000);
}

// Повторная проверка подписки
function retrySubscriptionCheck() {
    checkSubscription();
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
    
    // Сохраняем что пользователь прошел проверку
    localStorage.setItem('tg_subscription_verified', 'true');
    localStorage.setItem('tg_verified_channel', TELEGRAM_CHANNEL);
    
    setupTheme();
    loadGames();
    setupSearch();
}

// Показать ошибку "не в Telegram"
function showNotInTelegramError() {
    const html = `
        <div class="not-in-telegram">
            <div class="error-icon">
                <i class="fab fa-telegram"></i>
            </div>
            
            <h2>Требуется Telegram</h2>
            
            <p>Это приложение работает только внутри Telegram Messenger</p>
            
            <div class="telegram-buttons">
                <a href="https://t.me/SimpleDLC" target="_blank" class="tg-direct-btn">
                    <i class="fab fa-telegram"></i> Открыть в Telegram
                </a>
                
                <a href="tg://resolve?domain=SimpleDLC" class="tg-deep-link">
                    <i class="fas fa-mobile-alt"></i> Открыть в приложении
                </a>
            </div>
            
            <div class="instruction">
                <p><strong>Как открыть:</strong></p>
                <ol>
                    <li>Откройте Telegram</li>
                    <li>Найдите канал @SimpleDLC</li>
                    <li>Запустите приложение из канала</li>
                </ol>
            </div>
        </div>
    `;
    
    showCheckResult('error', html);
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
    
    // Логируем скачивание
    console.log(`User ${Telegram.WebApp.initDataUnsafe.user?.id} downloading game ${gameId}`);
    
    // Открываем ссылку
    if (Telegram.WebApp.openLink) {
        Telegram.WebApp.openLink(link);
    } else {
        window.open(link, '_blank');
    }
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

    // Используем тему Telegram
    if (isTelegramWebApp()) {
        const tgTheme = Telegram.WebApp.colorScheme;
        if (tgTheme === 'dark') {
            body.classList.add('dark-theme');
            themeToggle.checked = true;
        }
        
        // Следим за изменением темы
        Telegram.WebApp.onEvent('themeChanged', function() {
            if (Telegram.WebApp.colorScheme === 'dark') {
                body.classList.add('dark-theme');
                themeToggle.checked = true;
            } else {
                body.classList.remove('dark-theme');
                themeToggle.checked = false;
            }
        });
    }

    // Переключение темы
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('dark-theme');
        } else {
            body.classList.remove('dark-theme');
        }
    });
}

// Глобальные функции
window.openChannelForCheck = openChannelForCheck;
window.confirmSubscription = confirmSubscription;
window.openChannelAndCheck = openChannelAndCheck;
window.retrySubscriptionCheck = retrySubscriptionCheck;
window.loadGames = loadGames;
window.handleDownload = handleDownload;

// Отладочная информация
window.debugInfo = function() {
    if (isTelegramWebApp()) {
        const user = Telegram.WebApp.initDataUnsafe.user;
        console.log('=== Telegram Debug Info ===');
        console.log('User:', user);
        console.log('Theme:', Telegram.WebApp.colorScheme);
        console.log('Platform:', Telegram.WebApp.platform);
        console.log('Version:', Telegram.WebApp.version);
    }
    console.log('Games data:', gamesData);
};

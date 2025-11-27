// Конфигурация
const CONFIG = {
    // Список каналов для проверки (username без @)
    CHANNELS_TO_CHECK: [
        'SimpleDLC',
        'telegram',
        'durov'
    ],
    
    // Задержка между проверками (мс)
    CHECK_DELAY: 1000
};

// Глобальные переменные
let userData = null;
let subscriptionResults = {};

// Инициализация приложения
function initializeApp() {
    console.log('Initializing Telegram Mini App...');
    
    // Проверяем доступность Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
        initTelegramApp();
    } else {
        // Ждем загрузку Telegram Web App
        setTimeout(() => {
            if (window.Telegram && window.Telegram.WebApp) {
                initTelegramApp();
            } else {
                showError('Telegram Web App не загрузился. Попробуйте обновить страницу.');
            }
        }, 1000);
    }
}

// Инициализация Telegram Web App
function initTelegramApp() {
    try {
        console.log('Telegram Web App found, initializing...');
        
        // Инициализируем Telegram Web App
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        
        // Загружаем данные пользователя
        loadUserData();
        
        // Показываем информацию о пользователе
        displayUserInfo();
        
        // Загружаем список каналов
        displayChannelsList();
        
        // Показываем основной контент
        document.getElementById('loading').style.display = 'none';
        document.getElementById('userInfo').style.display = 'block';
        
        // Автоматически проверяем подписки
        setTimeout(checkAllSubscriptions, 500);
        
    } catch (error) {
        console.error('Error initializing Telegram App:', error);
        showError('Ошибка инициализации: ' + error.message);
    }
}

// Загрузка данных пользователя
function loadUserData() {
    const initData = Telegram.WebApp.initDataUnsafe;
    console.log('Telegram initData:', initData);
    
    if (initData && initData.user) {
        userData = {
            id: initData.user.id,
            username: initData.user.username || 'Не указан',
            firstName: initData.user.first_name || 'Не указано',
            lastName: initData.user.last_name || 'Не указано',
            language: initData.user.language_code || 'Не указан',
            isPremium: initData.user.is_premium || false
        };
    } else {
        userData = {
            id: 'Не доступен',
            username: 'Не доступен',
            firstName: 'Не доступен', 
            lastName: 'Не указано',
            language: 'Не доступен',
            isPremium: false
        };
    }
}

// Отображение информации о пользователе
function displayUserInfo() {
    if (!userData) return;
    
    document.getElementById('userId').textContent = userData.id;
    document.getElementById('username').textContent = '@' + userData.username;
    document.getElementById('firstName').textContent = userData.firstName;
    document.getElementById('lastName').textContent = userData.lastName;
    document.getElementById('language').textContent = userData.language;
    document.getElementById('platform').textContent = Telegram.WebApp.platform;
}

// Отображение списка каналов
function displayChannelsList() {
    const channelsList = document.getElementById('channelsList');
    
    channelsList.innerHTML = CONFIG.CHANNELS_TO_CHECK.map(channel => `
        <div class="channel-item" id="channel-${channel}">
            <div class="channel-icon">
                <i class="fab fa-telegram"></i>
            </div>
            <div class="channel-info">
                <div class="channel-name">@${channel}</div>
                <div class="channel-status" id="status-${channel}">
                    <i class="fas fa-clock"></i> Ожидание проверки...
                </div>
            </div>
            <button class="btn-check" onclick="checkSingleChannel('${channel}')">
                <i class="fas fa-sync-alt"></i>
            </button>
        </div>
    `).join('');
}

// Проверка всех подписок
async function checkAllSubscriptions() {
    const channels = CONFIG.CHANNELS_TO_CHECK;
    
    for (let i = 0; i < channels.length; i++) {
        const channel = channels[i];
        await checkChannelSubscription(channel);
        
        // Задержка между проверками
        if (i < channels.length - 1) {
            await new Promise(resolve => setTimeout(resolve, CONFIG.CHECK_DELAY));
        }
    }
    
    updateDebugInfo();
}

// Проверка одного канала
async function checkSingleChannel(channel) {
    await checkChannelSubscription(channel);
    updateDebugInfo();
}

// Проверка подписки на конкретный канал
async function checkChannelSubscription(channel) {
    return new Promise((resolve) => {
        const statusElement = document.getElementById(`status-${channel}`);
        const channelElement = document.getElementById(`channel-${channel}`);
        
        // Обновляем статус на "Проверка..."
        statusElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Проверка...';
        
        // Пытаемся использовать Telegram Web App API для проверки подписки
        if (Telegram.WebApp.checkSubscription) {
            console.log('Using Telegram.WebApp.checkSubscription for channel:', channel);
            
            const checkButton = {
                type: 'check_subscription',
                subscription_id: channel,
                payload: JSON.stringify({ user_id: userData.id })
            };
            
            Telegram.WebApp.checkSubscription(checkButton, (result) => {
                console.log('Subscription check result for', channel, ':', result);
                
                const isSubscribed = result === true;
                subscriptionResults[channel] = isSubscribed;
                
                updateChannelStatus(channel, isSubscribed, 'Telegram API');
                resolve(isSubscribed);
            });
            
        } else {
            console.log('Telegram.WebApp.checkSubscription not available, using fallback');
            // Fallback метод - всегда показывает подписан для демонстрации
            setTimeout(() => {
                const isSubscribed = true; // Для демо всегда true
                subscriptionResults[channel] = isSubscribed;
                
                updateChannelStatus(channel, isSubscribed, 'Fallback');
                resolve(isSubscribed);
            }, 1500);
        }
    });
}

// Обновление статуса канала
function updateChannelStatus(channel, isSubscribed, method) {
    const statusElement = document.getElementById(`status-${channel}`);
    const channelElement = document.getElementById(`channel-${channel}`);
    
    if (isSubscribed) {
        statusElement.innerHTML = `<i class="fas fa-check"></i> <span class="status-subscribed">Подписан (${method})</span>`;
        channelElement.style.borderLeft = '4px solid #28a745';
    } else {
        statusElement.innerHTML = `<i class="fas fa-times"></i> <span class="status-not-subscribed">Не подписан (${method})</span>`;
        channelElement.style.borderLeft = '4px solid #dc3545';
    }
}

// Обновление отладочной информации
function updateDebugInfo() {
    const debugData = {
        userData: userData,
        subscriptionResults: subscriptionResults,
        telegramWebApp: {
            platform: Telegram.WebApp.platform,
            version: Telegram.WebApp.version,
            colorScheme: Telegram.WebApp.colorScheme,
            initData: Telegram.WebApp.initData ? 'Available' : 'Not available',
            initDataUnsafe: Telegram.WebApp.initDataUnsafe ? 'Available' : 'Not available'
        },
        availableMethods: {
            checkSubscription: typeof Telegram.WebApp.checkSubscription === 'function',
            openTelegramLink: typeof Telegram.WebApp.openTelegramLink === 'function',
            showPopup: typeof Telegram.WebApp.showPopup === 'function'
        }
    };
    
    document.getElementById('debugData').textContent = JSON.stringify(debugData, null, 2);
}

// Показать/скрыть debug информацию
function toggleDebug() {
    const debugInfo = document.getElementById('debugInfo');
    debugInfo.style.display = debugInfo.style.display === 'none' ? 'block' : 'none';
}

// Обновление данных
function refreshData() {
    location.reload();
}

// Показать ошибку
function showError(message) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('error').style.display = 'block';
    document.getElementById('errorMessage').textContent = message;
}

// Открыть канал в Telegram
function openChannel(channel) {
    if (Telegram.WebApp.openTelegramLink) {
        Telegram.WebApp.openTelegramLink(`https://t.me/${channel}`);
    } else {
        window.open(`https://t.me/${channel}`, '_blank');
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initializeApp);

// Глобальные функции
window.refreshData = refreshData;
window.toggleDebug = toggleDebug;
window.checkAllSubscriptions = checkAllSubscriptions;
window.checkSingleChannel = checkSingleChannel;
window.openChannel = openChannel;

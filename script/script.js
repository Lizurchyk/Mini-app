// Конфигурация
const CONFIG = {
    // Список каналов для проверки (username без @)
    CHANNELS_TO_CHECK: [
        'SimpleDLC',
        'telegram',
        'durov',
        'tginfo'
    ],
    
    // Задержка между проверками (мс)
    CHECK_DELAY: 1000
};

// Глобальные переменные
let userData = null;
let subscriptionResults = {};

// Инициализация приложения
async function initializeApp() {
    try {
        // Проверяем, что мы в Telegram Web App
        if (typeof Telegram === 'undefined' || !Telegram.WebApp) {
            throw new Error('Это приложение работает только внутри Telegram');
        }

        // Инициализируем Telegram Web App
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        
        // Загружаем данные пользователя
        await loadUserData();
        
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
        showError(error.message);
    }
}

// Загрузка данных пользователя
function loadUserData() {
    return new Promise((resolve) => {
        const initData = Telegram.WebApp.initDataUnsafe;
        
        if (initData.user) {
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
                lastName: 'Не доступен',
                language: 'Не доступен',
                isPremium: false
            };
        }
        
        resolve();
    });
}

// Отображение информации о пользователе
function displayUserInfo() {
    if (!userData) return;
    
    document.getElementById('userId').textContent = userData.id;
    document.getElementById('username').textContent = userData.username;
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

// Проверка подписки на конкретный канал
async function checkChannelSubscription(channel) {
    return new Promise((resolve) => {
        const statusElement = document.getElementById(`status-${channel}`);
        const channelElement = document.getElementById(`channel-${channel}`);
        
        // Обновляем статус на "Проверка..."
        statusElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Проверка...';
        
        // Используем Telegram Web App API для проверки подписки
        if (Telegram.WebApp.checkSubscription) {
            const checkButton = {
                type: 'check_subscription',
                subscription_id: channel,
                payload: JSON.stringify({ user_id: userData.id })
            };
            
            Telegram.WebApp.checkSubscription(checkButton, (result) => {
                const isSubscribed = result === true;
                
                subscriptionResults[channel] = isSubscribed;
                
                // Обновляем отображение
                if (isSubscribed) {
                    statusElement.innerHTML = '<i class="fas fa-check"></i> <span class="status-subscribed">Подписан</span>';
                    channelElement.style.borderLeft = '4px solid #28a745';
                } else {
                    statusElement.innerHTML = '<i class="fas fa-times"></i> <span class="status-not-subscribed">Не подписан</span>';
                    channelElement.style.borderLeft = '4px solid #dc3545';
                }
                
                resolve(isSubscribed);
            });
        } else {
            // Если метод не доступен, используем альтернативную проверку
            setTimeout(() => {
                const isSubscribed = Math.random() > 0.5; // Случайный результат для демо
                
                subscriptionResults[channel] = isSubscribed;
                
                if (isSubscribed) {
                    statusElement.innerHTML = '<i class="fas fa-check"></i> <span class="status-subscribed">Подписан (демо)</span>';
                    channelElement.style.borderLeft = '4px solid #28a745';
                } else {
                    statusElement.innerHTML = '<i class="fas fa-times"></i> <span class="status-not-subscribed">Не подписан (демо)</span>';
                    channelElement.style.borderLeft = '4px solid #dc3545';
                }
                
                resolve(isSubscribed);
            }, 1000);
        }
    });
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
            initData: Telegram.WebApp.initData,
            initDataUnsafe: Telegram.WebApp.initDataUnsafe
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

// Тoggle dark theme (для тестирования)
function toggleDarkTheme() {
    document.body.classList.toggle('dark');
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initializeApp);

// Глобальные функции для кнопок
window.refreshData = refreshData;
window.toggleDebug = toggleDebug;
window.checkAllSubscriptions = checkAllSubscriptions;
window.toggleDarkTheme = toggleDarkTheme;

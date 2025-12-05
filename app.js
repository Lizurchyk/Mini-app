// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Глобальные переменные
let currentUserId = null;
let unsubscribedChannels = [];

// Функция форматирования текста с переносами строк
function formatTextWithLineBreaks(text) {
    if (!text) return '';
    // Заменяем \n на HTML тег <br>
    const formattedText = text
        .replace(/\\n/g, '<br>')  // Для сохраненных \n
        .replace(/\n/g, '<br>');  // Для новых переносов
    return formattedText;
}

// Инициализация логотипа
function initLogo() {
    const logoImg = document.getElementById('logoImg');
    const logo = document.querySelector('.logo');
    
    // Устанавливаем фото канала
    logoImg.style.backgroundImage = `url('${CONFIG.MAIN_CHANNEL.photo}')`;
    
    // Клик по логотипу - открывает заданный канал
    logo.onclick = function() {
        tg.openTelegramLink(`https://t.me/${CONFIG.MAIN_CHANNEL.username}`);
    };
}

// Получение ID пользователя
function getUserId() {
    if (tg.initDataUnsafe?.user?.id) {
        return tg.initDataUnsafe.user.id.toString();
    }
    
    if (tg.initData) {
        try {
            const params = new URLSearchParams(tg.initData);
            const userParam = params.get('user');
            if (userParam) {
                const userData = JSON.parse(decodeURIComponent(userParam));
                return userData.id.toString();
            }
        } catch (e) {}
    }
    
    return null;
}

// Проверка премиум доступа
function isPremiumUser(userId) {
    if (!userId) return false;
    
    const premiumData = CONFIG.PREMIUM_USERS[userId];
    if (!premiumData) return false;
    
    if (premiumData.expires) {
        const expireDate = new Date(premiumData.expires);
        const today = new Date();
        return today <= expireDate;
    }
    
    return true;
}

// Обновление статуса пользователя
function updateUserStatus(isPremium) {
    const userStatus = document.getElementById('userStatus');
    if (isPremium) {
        userStatus.className = 'user-status premium';
        userStatus.textContent = 'Premium';
    } else {
        userStatus.className = 'user-status user';
        userStatus.textContent = 'User';
    }
}

// Проверка подписки на каналы (возвращает массив неподписанных каналов)
async function checkChannelSubscription(userId) {
    if (!userId) return [];
    
    const unsubscribed = [];
    
    try {
        for (const channel of CONFIG.SUBSCRIPTION_CHANNELS) {
            const response = await fetch(
                `https://api.telegram.org/bot${CONFIG.BOT_TOKEN}/getChatMember?chat_id=${channel.name}&user_id=${userId}`
            );
            const data = await response.json();
            
            const isSubscribed = data.ok && 
                ['member', 'administrator', 'creator'].includes(data.result.status);
            
            if (!isSubscribed) {
                unsubscribed.push(channel);
            }
        }
        unsubscribedChannels = unsubscribed;
        return unsubscribed;
    } catch (error) {
        console.error('Ошибка проверки подписки:', error);
        // При ошибке показываем все каналы
        unsubscribedChannels = [...CONFIG.SUBSCRIPTION_CHANNELS];
        return unsubscribedChannels;
    }
}

// Показать экран подписки (только неподписанные каналы)
function showSubscriptionScreen(unsubscribed) {
    const container = document.getElementById('results_search');
    const searchContainer = document.querySelector('.search-container');
    
    // Скрываем поиск
    searchContainer.style.display = 'none';
    
    if (unsubscribed.length === 0) {
        // Если все каналы подписаны, показываем игры
        showGames(false);
        searchContainer.style.display = 'block';
        return;
    }
    
    const channelsList = unsubscribed.map(channel => `
        <div class="channel-item">
            <a href="https://t.me/${channel.username}" target="_blank">${channel.name}</a>
            <button onclick="tg.openTelegramLink('https://t.me/${channel.username}')">
                Подписаться
            </button>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div class="subscription-screen">
            <h2>❌ Требуется подписка</h2>
            <p>Для доступа к играм необходимо подписаться на ${unsubscribed.length} канал(ов):</p>
            <div class="channel-list">
                ${channelsList}
            </div>
            <button class="subscribe-btn" onclick="subscribeToAll()">
                📢 Подписаться на все (${unsubscribed.length})
            </button>
            <br>
            <button class="check-btn" onclick="recheckSubscription()">
                🔄 Я подписался, проверить
            </button>
        </div>
    `;
}

// Подписаться на все неподписанные каналы
function subscribeToAll() {
    if (unsubscribedChannels.length === 0) return;
    
    unsubscribedChannels.forEach(channel => {
        tg.openTelegramLink(`https://t.me/${channel.username}`);
    });
    
    tg.showAlert(`Открыто ${unsubscribedChannels.length} канал(ов) для подписки. Пожалуйста, подпишитесь на каждый из них.`);
}

// Перепроверка подписки
async function recheckSubscription() {
    const userId = getUserId();
    if (!userId) {
        showSubscriptionScreen([...CONFIG.SUBSCRIPTION_CHANNELS]);
        return;
    }
    
    // Показываем загрузку
    const container = document.getElementById('results_search');
    container.innerHTML = `
        <div class="subscription-screen">
            <h2>⏳ Проверка подписки...</h2>
            <p>Пожалуйста, подождите</p>
        </div>
    `;
    
    const unsubscribed = await checkChannelSubscription(userId);
    
    if (unsubscribed.length === 0) {
        // Все каналы подписаны
        showGames(false);
        const searchContainer = document.querySelector('.search-container');
        searchContainer.style.display = 'block';
        tg.showAlert('✅ Отлично! Вы подписаны на все каналы. Доступ открыт!');
    } else {
        // Есть неподписанные каналы
        showSubscriptionScreen(unsubscribed);
        tg.showAlert(`❌ Вы не подписаны на ${unsubscribed.length} канал(ов). Пожалуйста, подпишитесь на все указанные выше каналы.`);
    }
}

// Создание карточки игры (без цены) с поддержкой переносов строк
function createGameCard(game, isPremium) {
    // Получаем ссылку в зависимости от статуса пользователя
    const downloadLink = isPremium ? 
        (game.link?.premium || game.link) : 
        (game.link?.user || game.link);
    
    // Проверяем наличие обязательных полей
    if (!game.name || !game.description || !game.version || !game.img || !downloadLink) {
        console.error('Недостаточно данных для создания карточки:', game);
        return '';
    }
    
    // Форматируем описание с поддержкой переносов строк
    const formattedDescription = formatTextWithLineBreaks(game.description);
    
    return `
        <div class="card">
            <img src="${game.img}" alt="${game.name}" onerror="this.src='https://via.placeholder.com/300x180?text=Нет+изображения'">
            <div class="card-text">
                <p1>${game.name}</p1>
                <div class="product-version">${game.version}</div>
                <p2>${formattedDescription}</p2>
            </div>
            <button onclick="downloadGame('${downloadLink}', '${game.name}')">
                📥 Скачать
            </button>
        </div>
    `;
}

// Отображение игр
function showGames(isPremium) {
    const container = document.getElementById('results_search');
    const searchContainer = document.querySelector('.search-container');
    
    // Показываем поиск
    searchContainer.style.display = 'block';
    
    // Фильтруем игры, у которых есть все необходимые данные
    const validGames = CONFIG.GAMES.filter(game => 
        game.name && game.description && game.version && game.img && 
        (game.link || (game.link?.user && game.link?.premium))
    );
    
    if (validGames.length === 0) {
        container.innerHTML = '<div class="no-results">Нет доступных игр</div>';
        return;
    }
    
    const cards = validGames.map(game => createGameCard(game, isPremium)).join('');
    container.innerHTML = `<div class="cards-container">${cards}</div>`;
    
    // Обновляем статус пользователя
    updateUserStatus(isPremium);
}

// Поиск игр
function searchGames() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const userId = getUserId();
    const isPremium = isPremiumUser(userId);
    
    if (!searchTerm.trim()) {
        showGames(isPremium);
        return;
    }
    
    // Ищем по имени, описанию и версии (без учета HTML тегов для поиска)
    const filtered = CONFIG.GAMES.filter(game => {
        // Для поиска используем чистый текст без HTML
        const cleanDescription = game.description ? 
            game.description.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '') : '';
        
        return (
            (game.name && game.name.toLowerCase().includes(searchTerm)) ||
            (cleanDescription && cleanDescription.toLowerCase().includes(searchTerm)) ||
            (game.version && game.version.toLowerCase().includes(searchTerm))
        );
    });
    
    const container = document.getElementById('results_search');
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="no-results">Игры не найдены</div>';
    } else {
        const cards = filtered.map(game => createGameCard(game, isPremium)).join('');
        container.innerHTML = `<div class="cards-container">${cards}</div>`;
    }
}

// Очистить поиск
function clearSearch() {
    document.getElementById('search').value = '';
    const userId = getUserId();
    const isPremium = isPremiumUser(userId);
    showGames(isPremium);
}

// Скачивание игры
function downloadGame(url, gameName) {
    if (!url) {
        tg.showAlert('Ссылка для скачивания не найдена');
        return;
    }
    
    tg.openLink(url);
    console.log(`Скачана игра: ${gameName}`);
}

// Основная проверка доступа
async function checkAccess() {
    currentUserId = getUserId();
    
    // Инициализируем логотип
    initLogo();
    
    if (!currentUserId) {
        // Если ID не найден, показываем все каналы
        showSubscriptionScreen([...CONFIG.SUBSCRIPTION_CHANNELS]);
        return;
    }
    
    // Проверяем премиум доступ
    const premium = isPremiumUser(currentUserId);
    
    if (premium) {
        // Премиум пользователь - сразу показываем игры
        showGames(true);
        return;
    }
    
    // Обычный пользователь - проверяем подписку
    const unsubscribed = await checkChannelSubscription(currentUserId);
    
    if (unsubscribed.length === 0) {
        // Подписан на все каналы
        showGames(false);
    } else {
        // Не подписан на некоторые каналы
        showSubscriptionScreen(unsubscribed);
        updateUserStatus(false);
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', checkAccess);

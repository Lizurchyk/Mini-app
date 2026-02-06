const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Глобальные переменные
let currentUserId = null;
let unsubscribedChannels = [];

// Функция форматирования текста с переносами строк
function formatTextWithLineBreaks(text) {
    if (!text) return '';
    return text
        .replace(/\\n/g, '<br>')
        .replace(/\n/g, '<br>');
}

// Инициализация логотипа
function initLogo() {
    const logoImg = document.getElementById('logoImg');
    const logo = document.querySelector('.logo');
    
    if (logoImg && CONFIG.MAIN_CHANNEL?.photo) {
        logoImg.style.backgroundImage = `url('${CONFIG.MAIN_CHANNEL.photo}')`;
    }
    
    if (logo && CONFIG.MAIN_CHANNEL?.username) {
        logo.onclick = function() {
            tg.openTelegramLink(CONFIG.MAIN_CHANNEL.username);
        };
    }
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
    if (!userStatus) return;
    
    if (isPremium) {
        userStatus.className = 'user-status premium';
        userStatus.textContent = 'Premium';
    } else {
        userStatus.className = 'user-status user';
        userStatus.textContent = 'User';
    }
}

// Проверка подписки на один канал
async function checkSingleChannelSubscription(userId, channel) {
    if (!userId || !channel.chat_id) return false;
    
    try {
        const response = await fetch(
            `https://api.telegram.org/bot${CONFIG.BOT_TOKEN}/getChatMember?chat_id=${channel.chat_id}&user_id=${userId}`
        );
        
        if (!response.ok) {
            console.log(`HTTP ошибка для ${channel.name}: ${response.status}`);
            return false;
        }
        
        const data = await response.json();
        
        if (!data.ok) {
            console.log(`API ошибка для ${channel.name}: ${data.description}`);
            return false;
        }
        
        const isSubscribed = ['member', 'administrator', 'creator'].includes(data.result.status);
        console.log(`${channel.name}: ${isSubscribed ? 'подписан' : 'не подписан'}`);
        return isSubscribed;
        
    } catch (error) {
        console.error(`Ошибка проверки ${channel.name}:`, error);
        return false;
    }
}

// Проверка подписки на все каналы
async function checkChannelSubscription(userId) {
    if (!userId) return [...CONFIG.SUBSCRIPTION_CHANNELS];
    
    const unsubscribed = [];
    
    // Проверяем только каналы, у которых есть chat_id
    const checkableChannels = CONFIG.SUBSCRIPTION_CHANNELS.filter(ch => ch.chat_id);
    
    for (const channel of checkableChannels) {
        const isSubscribed = await checkSingleChannelSubscription(userId, channel);
        
        if (!isSubscribed) {
            unsubscribed.push(channel);
        }
        
        // Пауза между запросами
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Добавляем каналы без chat_id (их не проверяем, но показываем)
    const nonCheckableChannels = CONFIG.SUBSCRIPTION_CHANNELS.filter(ch => !ch.chat_id);
    unsubscribed.push(...nonCheckableChannels);
    
    unsubscribedChannels = unsubscribed;
    return unsubscribed;
}

// Показать экран подписки
function showSubscriptionScreen(unsubscribed) {
    const container = document.getElementById('results_search');
    const searchContainer = document.querySelector('.search-container');
    
    if (!container) return;
    
    // Скрываем поиск
    if (searchContainer) {
        searchContainer.style.display = 'none';
    }
    
    if (!unsubscribed || unsubscribed.length === 0) {
        showGames(false);
        if (searchContainer) searchContainer.style.display = 'block';
        return;
    }
    
    // Создаем список каналов
    const channelsList = unsubscribed.map(channel => {
        const hasChatId = channel.chat_id ? '' : '';
        return `
        <div class="channel-item">
            <div class="channel-info">
                <div class="channel-name">${channel.name}</div>
                <div class="channel-status">${hasChatId}</div>
                ${channel.description ? `<div class="channel-description">${channel.description}</div>` : ''}
            </div>
            <button onclick="tg.openTelegramLink('${channel.username}')">
                Подписаться
            </button>
        </div>
    `}).join('');
    
    container.innerHTML = `
        <div class="subscription-screen">
            <h2>📢 Требуется подписка</h2>
            <p>Для доступа к играм подпишитесь на эти каналы:</p>
            <div class="channel-list">
                ${channelsList}
            </div>
            <button class="subscribe-btn" onclick="subscribeToAll()">
                📲 Открыть все каналы (${unsubscribed.length})
            </button>
            <br>
            <button class="check-btn" onclick="recheckSubscription()">
                🔄 Я подписался, проверить
            </button>
        </div>
    `;
}

// Открыть все каналы
function subscribeToAll() {
    if (!unsubscribedChannels || unsubscribedChannels.length === 0) return;
    
    // Открываем все ссылки по очереди
    unsubscribedChannels.forEach((channel, index) => {
        setTimeout(() => {
            tg.openTelegramLink(channel.username);
        }, index * 500);
    });
    
    tg.showAlert(`Открыто ${unsubscribedChannels.length} каналов. Подпишитесь и нажмите "Я подписался, проверить".`);
}

// Перепроверка подписки
async function recheckSubscription() {
    const userId = getUserId();
    if (!userId) {
        showSubscriptionScreen([...CONFIG.SUBSCRIPTION_CHANNELS]);
        return;
    }
    
    const container = document.getElementById('results_search');
    if (!container) return;
    
    // Показываем загрузку
    container.innerHTML = `
        <div class="subscription-screen">
            <h2>⏳ Проверяем подписку...</h2>
            <p>Пожалуйста, подождите</p>
        </div>
    `;
    
    const unsubscribed = await checkChannelSubscription(userId);
    
    if (unsubscribed.length === 0) {
        showGames(false);
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) searchContainer.style.display = 'block';
        tg.showAlert('✅ Отлично! Вы подписаны на все каналы!');
    } else {
        showSubscriptionScreen(unsubscribed);
        tg.showAlert(`❌ Вы не подписаны на ${unsubscribed.length} канал(ов).`);
    }
}

// Создание карточки игры
function createGameCard(game, isPremium) {
    const downloadLink = isPremium ? 
        (game.link?.premium || game.link) : 
        (game.link?.user || game.link);
    
    if (!game.name || !game.description || !game.version || !game.img || !downloadLink) {
        console.error('Недостаточно данных для игры:', game);
        return '';
    }
    
    const formattedDescription = formatTextWithLineBreaks(game.description);
    
    return `
        <div class="card">
            <img src="${game.img}" alt="${game.name}" 
                 onerror="this.src='https://via.placeholder.com/300x180?text=Нет+изображения'">
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
    
    if (!container) return;
    
    // Показываем поиск
    if (searchContainer) {
        searchContainer.style.display = 'block';
    }
    
    if (!CONFIG.GAMES || CONFIG.GAMES.length === 0) {
        container.innerHTML = '<div class="no-results">Нет доступных игр</div>';
        return;
    }
    
    const validGames = CONFIG.GAMES.filter(game => 
        game && 
        game.name && 
        game.description && 
        game.version && 
        game.img && 
        (game.link || (game.link?.user && game.link?.premium))
    );
    
    if (validGames.length === 0) {
        container.innerHTML = '<div class="no-results">Нет доступных игр</div>';
        return;
    }
    
    const cards = validGames.map(game => createGameCard(game, isPremium)).join('');
    container.innerHTML = `<div class="cards-container">${cards}</div>`;
    
    updateUserStatus(isPremium);
}

// Поиск игр
function searchGames() {
    const searchInput = document.getElementById('search');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const userId = getUserId();
    const isPremium = isPremiumUser(userId);
    
    if (!searchTerm.trim()) {
        showGames(isPremium);
        return;
    }
    
    const container = document.getElementById('results_search');
    if (!container) return;
    
    const filtered = CONFIG.GAMES.filter(game => {
        if (!game) return false;
        
        const cleanDescription = game.description ? 
            game.description.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '') : '';
        
        return (
            (game.name && game.name.toLowerCase().includes(searchTerm)) ||
            (cleanDescription && cleanDescription.toLowerCase().includes(searchTerm)) ||
            (game.version && game.version.toLowerCase().includes(searchTerm))
        );
    });
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="no-results">Игры не найдены</div>';
    } else {
        const cards = filtered.map(game => createGameCard(game, isPremium)).join('');
        container.innerHTML = `<div class="cards-container">${cards}</div>`;
    }
}

// Очистить поиск
function clearSearch() {
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.value = '';
    }
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
    
    initLogo();
    
    if (!currentUserId) {
        showSubscriptionScreen([...CONFIG.SUBSCRIPTION_CHANNELS]);
        return;
    }
    
    const premium = isPremiumUser(currentUserId);
    
    if (premium) {
        showGames(true);
        return;
    }
    
    const unsubscribed = await checkChannelSubscription(currentUserId);
    
    if (unsubscribed.length === 0) {
        showGames(false);
    } else {
        showSubscriptionScreen(unsubscribed);
        updateUserStatus(false);
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', checkAccess);
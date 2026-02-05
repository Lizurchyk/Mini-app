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
    return text
        .replace(/\\n/g, '<br>')
        .replace(/\n/g, '<br>');
}

// Инициализация логотипа
function initLogo() {
    const logoImg = document.getElementById('logoImg');
    const logo = document.querySelector('.logo');
    
    logoImg.style.backgroundImage = `url('${CONFIG.MAIN_CHANNEL.photo}')`;
    
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

// Проверка подписки на каналы
async function checkChannelSubscription(userId) {
    if (!userId) return [...CONFIG.SUBSCRIPTION_CHANNELS];
    
    const unsubscribed = [];
    
    try {
        for (const channel of CONFIG.SUBSCRIPTION_CHANNELS) {
            const response = await fetch(
                `https://api.telegram.org/bot\( {CONFIG.BOT_TOKEN}/getChatMember?chat_id=@ \){channel.username}&user_id=${userId}`,
                { cache: 'no-store' }
            );
            
            if (!response.ok) {
                unsubscribed.push(channel);
                continue;
            }
            
            const data = await response.json();
            
            const isSubscribed = data.ok && 
                ['member', 'administrator', 'creator', 'restricted'].includes(data.result?.status);
            
            if (!isSubscribed) {
                unsubscribed.push(channel);
            }
            
            // Небольшая задержка между запросами (анти-флуд)
            await new Promise(r => setTimeout(r, 700 + Math.random() * 500));
        }
        
        unsubscribedChannels = unsubscribed;
        return unsubscribed;
    } catch (error) {
        console.error('Ошибка проверки подписки:', error);
        unsubscribedChannels = [...CONFIG.SUBSCRIPTION_CHANNELS];
        return unsubscribedChannels;
    }
}

// Показать экран подписки
function showSubscriptionScreen(unsubscribed) {
    const container = document.getElementById('results_search');
    const searchContainer = document.querySelector('.search-container');
    
    searchContainer.style.display = 'none';
    
    if (unsubscribed.length === 0) {
        showGames(false);
        searchContainer.style.display = 'block';
        return;
    }
    
    const channelsList = unsubscribed.map(channel => `
        <div class="channel-item">
            <span>${channel.name || '@' + channel.username}</span>
            <button onclick="tg.openLink('${channel.link}', { try_instant_view: false })">
                Подписаться
            </button>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div class="subscription-screen">
            <h2>❌ Требуется подписка</h2>
            <p>Для доступа необходимо подписаться на ${unsubscribed.length} канал(ов):</p>
            <div class="channel-list">
                ${channelsList}
            </div>
            <br>
            <button class="subscribe-btn" onclick="subscribeToAll()">
                📢 Подписаться на все
            </button>
            <br><br>
            <button class="check-btn" onclick="recheckSubscription()">
                🔄 Я подписался, проверить
            </button>
            <p style="margin-top: 16px; font-size: 0.9em; opacity: 0.8;">
                После подписки нажмите «Проверить». Проверка может занять до 10 секунд.
            </p>
        </div>
    `;
}

// Подписаться на все
function subscribeToAll() {
    if (unsubscribedChannels.length === 0) return;
    
    unsubscribedChannels.forEach(channel => {
        tg.openLink(channel.link, { try_instant_view: false });
    });
    
    tg.showAlert(`Открыты ссылки на ${unsubscribedChannels.length} канал(ов).\n\nПодпишитесь в каждом и нажмите «Проверить»`);
}

// Перепроверка подписки
async function recheckSubscription() {
    const userId = getUserId();
    if (!userId) {
        showSubscriptionScreen([...CONFIG.SUBSCRIPTION_CHANNELS]);
        return;
    }
    
    const container = document.getElementById('results_search');
    container.innerHTML = `
        <div class="subscription-screen">
            <h2>⏳ Проверка подписки...</h2>
            <p>Подождите несколько секунд</p>
        </div>
    `;
    
    // Задержка для обновления статуса в Telegram
    await new Promise(r => setTimeout(r, 4000));
    
    const unsubscribed = await checkChannelSubscription(userId);
    
    if (unsubscribed.length === 0) {
        showGames(isPremiumUser(userId));
        const searchContainer = document.querySelector('.search-container');
        searchContainer.style.display = 'block';
        tg.showAlert('✅ Отлично! Вы подписаны на все каналы. Доступ открыт!');
    } else {
        showSubscriptionScreen(unsubscribed);
        tg.showAlert(`❌ Вы не подписаны на ${unsubscribed.length} канал(ов)`);
    }
}

// Создание карточки игры
function createGameCard(game, isPremium) {
    const downloadLink = isPremium ? 
        (game.link?.premium || game.link) : 
        (game.link?.user || game.link);
    
    if (!game.name || !game.description || !game.version || !game.img || !downloadLink) {
        return '';
    }
    
    const formattedDescription = formatTextWithLineBreaks(game.description);
    
    return `
        <div class="card">
            <img src="\( {game.img}" alt=" \){game.name}" onerror="this.src='https://via.placeholder.com/300x180?text=Нет+изображения'">
            <div class="card-text">
                <p1>${game.name}</p1>
                <div class="product-version">${game.version}</div>
                <p2>${formattedDescription}</p2>
            </div>
            <button onclick="downloadGame('\( {downloadLink}', ' \){game.name}')">
                📥 Скачать
            </button>
        </div>
    `;
}

// Отображение игр
function showGames(isPremium) {
    const container = document.getElementById('results_search');
    const searchContainer = document.querySelector('.search-container');
    
    searchContainer.style.display = 'block';
    
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
    
    const cleanDescription = game => game.description 
        ? game.description.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '') 
        : '';
    
    const filtered = CONFIG.GAMES.filter(game => {
        return (
            (game.name && game.name.toLowerCase().includes(searchTerm)) ||
            (cleanDescription(game) && cleanDescription(game).toLowerCase().includes(searchTerm)) ||
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

// Запуск
document.addEventListener('DOMContentLoaded', checkAccess);
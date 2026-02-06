const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Глобальные переменные
let currentUserId = null;

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

// Показать экран подписки (ПРОСТО ПОКАЗЫВАЕМ КАНАЛЫ БЕЗ ПРОВЕРКИ)
function showSubscriptionScreen() {
    const container = document.getElementById('results_search');
    const searchContainer = document.querySelector('.search-container');
    
    if (!container) return;
    
    // Скрываем поиск
    if (searchContainer) {
        searchContainer.style.display = 'none';
    }
    
    // Если нет каналов для подписки, сразу показываем игры
    if (!CONFIG.SUBSCRIPTION_CHANNELS || CONFIG.SUBSCRIPTION_CHANNELS.length === 0) {
        showGames(false);
        if (searchContainer) searchContainer.style.display = 'block';
        return;
    }
    
    // Создаем список каналов
    const channelsList = CONFIG.SUBSCRIPTION_CHANNELS.map(channel => `
        <div class="channel-item">
            <div class="channel-info">
                <div class="channel-name">${channel.name}</div>
                ${channel.description ? `<div class="channel-description">${channel.description}</div>` : ''}
            </div>
            <button onclick="tg.openTelegramLink('${channel.username}')">
                Перейти
            </button>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div class="subscription-screen">
            <h2>📢 Требуется подписка</h2>
            <p>Для доступа к играм подпишитесь на эти каналы:</p>
            <div class="channel-list">
                ${channelsList}
            </div>
            <button class="subscribe-btn" onclick="subscribeToAll()">
                📲 Открыть все каналы (${CONFIG.SUBSCRIPTION_CHANNELS.length})
            </button>
            <br>
            <button class="check-btn" onclick="showGames(false)">
                ✅ Я подписался, продолжить
            </button>
        </div>
    `;
}

// Открыть все каналы
function subscribeToAll() {
    if (!CONFIG.SUBSCRIPTION_CHANNELS || CONFIG.SUBSCRIPTION_CHANNELS.length === 0) return;
    
    // Открываем все ссылки по очереди
    CONFIG.SUBSCRIPTION_CHANNELS.forEach((channel, index) => {
        setTimeout(() => {
            tg.openTelegramLink(channel.username);
        }, index * 500); // Задержка 0.5 секунды между открытием
    });
    
    tg.showAlert(`Открыты все каналы (${CONFIG.SUBSCRIPTION_CHANNELS.length}). Подпишитесь и нажмите "Я подписался, продолжить".`);
}

// Создание карточки игры
function createGameCard(game, isPremium) {
    // Получаем ссылку в зависимости от статуса
    const downloadLink = isPremium ? 
        (game.link?.premium || game.link) : 
        (game.link?.user || game.link);
    
    // Проверяем обязательные поля
    if (!game.name || !game.description || !game.version || !game.img || !downloadLink) {
        console.error('Недостаточно данных для игры:', game);
        return '';
    }
    
    // Форматируем описание
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
    
    // Проверяем, есть ли игры
    if (!CONFIG.GAMES || CONFIG.GAMES.length === 0) {
        container.innerHTML = '<div class="no-results">Нет доступных игр</div>';
        return;
    }
    
    // Фильтруем игры с обязательными полями
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
    
    // Создаем карточки
    const cards = validGames.map(game => createGameCard(game, isPremium)).join('');
    container.innerHTML = `<div class="cards-container">${cards}</div>`;
    
    // Обновляем статус
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
    
    // Фильтруем игры по поисковому запросу
    const filtered = CONFIG.GAMES.filter(game => {
        if (!game) return false;
        
        // Чистое описание без HTML
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
function checkAccess() {
    currentUserId = getUserId();
    
    // Инициализируем логотип
    initLogo();
    
    // Проверяем премиум доступ
    const premium = isPremiumUser(currentUserId);
    
    if (premium) {
        // Премиум пользователь - сразу показываем игры
        showGames(true);
    } else {
        // Обычный пользователь - показываем экран подписки
        showSubscriptionScreen();
        updateUserStatus(false);
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', checkAccess);
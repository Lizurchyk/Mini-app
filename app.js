// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

// Элементы DOM
const content = document.getElementById('content');
const loading = document.getElementById('loading');

// Симуляция данных о каналах (в реальном приложении используйте Telegram API)
const mockChannels = [
    {
        id: 1,
        title: "Telegram News",
        username: "telegram",
        subscribers: 5600000,
        isPublic: true
    },
    {
        id: 2,
        title: "Durov's Channel",
        username: "durov",
        subscribers: 1200000,
        isPublic: true
    },
    {
        id: 3,
        title: "Tech Updates",
        username: "techupdates",
        subscribers: 450000,
        isPublic: true
    },
    {
        id: 4,
        title: "Private Group",
        subscribers: 150,
        isPublic: false
    }
];

// Функция для форматирования чисел подписчиков
function formatSubscribers(count) {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
}

// Функция для получения первого символа названия канала
function getFirstChar(title) {
    return title.charAt(0).toUpperCase();
}

// Функция для отображения списка каналов
function renderChannels(channels) {
    if (!channels || channels.length === 0) {
        content.innerHTML = `
            <div class="empty-state">
                <h3>Подписок нет</h3>
                <p>Вы пока не подписаны ни на один канал</p>
            </div>
        `;
        return;
    }

    const channelsHTML = channels.map(channel => `
        <div class="channel-card" onclick="openChannel('${channel.username || channel.id}')">
            <div class="channel-avatar">
                ${getFirstChar(channel.title)}
            </div>
            <div class="channel-info">
                <div class="channel-name">${channel.title}</div>
                <div class="channel-subscribers">
                    ${formatSubscribers(channel.subscribers)} подписчиков
                    ${channel.username ? `• @${channel.username}` : ''}
                </div>
            </div>
            <div class="channel-status ${channel.isPublic ? 'status-public' : 'status-private'}">
                ${channel.isPublic ? 'Публичный' : 'Приватный'}
            </div>
        </div>
    `).join('');

    content.innerHTML = `
        <div class="channel-list">
            ${channelsHTML}
        </div>
    `;
}

// Функция для отображения ошибки
function showError(message) {
    content.innerHTML = `
        <div class="error-message">
            <strong>Ошибка</strong>
            <p>${message}</p>
            <button class="retry-button" onclick="loadSubscriptions()">Попробовать снова</button>
        </div>
    `;
}

// Функция для открытия канала
function openChannel(identifier) {
    if (identifier.startsWith('@') || isNaN(identifier)) {
        // Открываем канал по username
        tg.openTelegramLink(`https://t.me/${identifier.replace('@', '')}`);
    } else {
        // Для приватных каналов или каналов без username
        tg.showPopup({
            title: 'Информация',
            message: 'Этот канал не имеет публичной ссылки или является приватным',
            buttons: [{ type: 'ok' }]
        });
    }
}

// Основная функция загрузки подписок
async function loadSubscriptions() {
    try {
        loading.style.display = 'block';
        
        // В реальном приложении здесь должен быть вызов Telegram Bot API
        // Для демонстрации используем мок-данные с задержкой
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Проверяем, есть ли доступ к данным пользователя
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            const user = tg.initDataUnsafe.user;
            console.log('Пользователь:', `${user.first_name} ${user.last_name || ''}`);
        }
        
        renderChannels(mockChannels);
        
    } catch (error) {
        console.error('Ошибка загрузки подписок:', error);
        showError('Не удалось загрузить список подписок. Проверьте подключение к интернету.');
    } finally {
        loading.style.display = 'none';
    }
}

// Функция для реальной работы с Telegram API (требует настройки бота)
async function loadRealSubscriptions() {
    /* 
    // Раскомментируйте этот код для реального использования с Telegram Bot API
    
    const initData = tg.initData;
    
    try {
        const response = await fetch('/api/getUserChats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ initData })
        });
        
        if (!response.ok) {
            throw new Error('Ошибка сервера');
        }
        
        const data = await response.json();
        renderChannels(data.chats);
        
    } catch (error) {
        console.error('Error:', error);
        showError('Не удалось загрузить подписки');
    }
    */
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    // Устанавливаем тему Telegram
    document.body.style.backgroundColor = tg.themeParams.bg_color || '#ffffff';
    document.body.style.color = tg.themeParams.text_color || '#000000';
    
    // Загружаем подписки
    loadSubscriptions();
    
    // Обработчик изменения темы
    tg.onEvent('themeChanged', function() {
        document.body.style.backgroundColor = tg.themeParams.bg_color;
        document.body.style.color = tg.themeParams.text_color;
    });
    
    // Обработчик изменения viewport
    tg.onEvent('viewportChanged', function() {
        tg.expand();
    });
});

// Делаем функции глобальными для использования в HTML
window.openChannel = openChannel;
window.loadSubscriptions = loadSubscriptions;

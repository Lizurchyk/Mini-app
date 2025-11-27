const tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

// Конфигурация
const API_BASE_URL = 'http://localhost:5000'; // Замени на свой URL

// Элементы DOM
const content = document.getElementById('content');
const loading = document.getElementById('loading');
const stats = document.getElementById('stats');
const subscribedCount = document.getElementById('subscribedCount');
const totalCount = document.getElementById('totalCount');

// Функция для получения ID пользователя
function getUserId() {
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        return tg.initDataUnsafe.user.id;
    }
    return null;
}

// Функция для проверки подписок
async function checkSubscriptions() {
    const userId = getUserId();
    
    if (!userId) {
        showError('Не удалось получить ID пользователя');
        return;
    }

    try {
        loading.style.display = 'block';
        content.innerHTML = '';
        stats.style.display = 'none';

        const response = await fetch(`${API_BASE_URL}/api/check_subscriptions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId })
        });

        if (!response.ok) {
            throw new Error('Ошибка сервера');
        }

        const data = await response.json();
        
        if (data.success) {
            renderSubscriptions(data);
        } else {
            throw new Error(data.error || 'Неизвестная ошибка');
        }

    } catch (error) {
        console.error('Ошибка:', error);
        showError('Не удалось проверить подписки. Проверьте подключение к интернету.');
    } finally {
        loading.style.display = 'none';
    }
}

// Функция для отображения подписок
function renderSubscriptions(data) {
    const subscriptions = data.subscriptions;
    const subscribedCountValue = data.total_subscribed;
    const totalCountValue = data.total_channels;

    // Обновляем статистику
    subscribedCount.textContent = subscribedCountValue;
    totalCount.textContent = totalCountValue;
    stats.style.display = 'block';

    if (subscriptions.length === 0) {
        content.innerHTML = `
            <div class="empty-state">
                <h3>Нет каналов для проверки</h3>
                <p>Добавьте каналы в настройках бота</p>
            </div>
        `;
        return;
    }

    const subscriptionsHTML = subscriptions.map(channel => `
        <div class="channel-card">
            <div class="channel-avatar">
                ${getFirstChar(channel.title)}
            </div>
            <div class="channel-info">
                <div class="channel-name">${channel.title}</div>
                <div class="channel-username">
                    ${channel.username ? `@${channel.username}` : 'Без username'}
                    ${channel.members_count ? ` • ${formatNumber(channel.members_count)} подписчиков` : ''}
                </div>
            </div>
            <div class="subscription-status ${getStatusClass(channel)}">
                ${getStatusText(channel)}
            </div>
        </div>
    `).join('');

    content.innerHTML = `
        <div class="channel-list">
            ${subscriptionsHTML}
        </div>
    `;
}

// Вспомогательные функции
function getFirstChar(title) {
    return title ? title.charAt(0).toUpperCase() : '?';
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function getStatusClass(channel) {
    if (channel.status === 'error') return 'status-error';
    return channel.is_subscribed ? 'status-subscribed' : 'status-not-subscribed';
}

function getStatusText(channel) {
    if (channel.status === 'error') return 'Ошибка';
    return channel.is_subscribed ? 'Подписан' : 'Не подписан';
}

function showError(message) {
    content.innerHTML = `
        <div class="error-message">
            <strong>Ошибка</strong>
            <p>${message}</p>
            <button class="retry-button" onclick="checkSubscriptions()">Попробовать снова</button>
        </div>
    `;
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    document.body.style.backgroundColor = tg.themeParams.bg_color || '#ffffff';
    document.body.style.color = tg.themeParams.text_color || '#000000';
    
    checkSubscriptions();
    
    tg.onEvent('themeChanged', function() {
        document.body.style.backgroundColor = tg.themeParams.bg_color;
        document.body.style.color = tg.themeParams.text_color;
    });
});

// Глобальные функции
window.checkSubscriptions = checkSubscriptions;

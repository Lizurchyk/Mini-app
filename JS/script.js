// Данные игр
let gamesData = [];

// ПРЯМАЯ ССЫЛКА на ваш games.json файл
const GAMES_JSON_URL = 'https://raw.githubusercontent.com/Lizurchyk/Mini-app/refs/heads/main/games.json'; // ЗАМЕНИТЕ НА ВАШУ ССЫЛКУ

// Загрузка данных игр из JSON файла
async function loadGames() {
    try {
        console.log('Загрузка данных из:', GAMES_JSON_URL);
        
        const response = await fetch(GAMES_JSON_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        gamesData = await response.json();
        console.log('Данные успешно загружены:', gamesData);
        displayGames(gamesData);
        
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        showError(`Не удалось загрузить данные: ${error.message}`);
    }
}

// Показать ошибку
function showError(message) {
    const container = document.getElementById('gamesContainer');
    container.innerHTML = `
        <div class="no-results">
            <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 20px; color: #ff6b6b;"></i>
            <h3>Ошибка загрузки</h3>
            <p>${message}</p>
            <p style="margin-top: 10px; font-size: 14px; opacity: 0.7;">
                Проверьте ссылку: ${GAMES_JSON_URL}
            </p>
        </div>
    `;
}

// Отображение карточек игр
function displayGames(games) {
    const container = document.getElementById('gamesContainer');
    
    if (!games || games.length === 0) {
        container.innerHTML = '<div class="no-results">Нет доступных игр</div>';
        return;
    }

    container.innerHTML = games.map(game => `
        <div class="game-card" data-id="${game.id}">
            <img src="${game.image}" alt="${game.name}" class="game-image" 
                 onerror="this.src='https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=250&fit=crop'">
            <div class="game-info">
                <h3 class="game-title">${game.name}</h3>
                <p class="game-description">${game.description}</p>
                <div class="game-meta">
                    <span>Версия: ${game.version}</span>
                    <span class="game-mod">${game.modification}</span>
                </div>
                <a href="${game.link}" class="game-link" target="_blank">Скачать</a>
            </div>
        </div>
    `).join('');
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
        game.description.toLowerCase().includes(searchTerm) ||
        game.modification.toLowerCase().includes(searchTerm)
    );

    displayGames(filteredGames);
}

// Управление темой
function setupTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Загрузка сохраненной темы
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.checked = true;
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

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    setupTheme();
    loadGames();

    // Поиск при вводе
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchGames(this.value);
        }, 300);
    });

    // Поиск при нажатии Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchGames(this.value);
        }
    });
});

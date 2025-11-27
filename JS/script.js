// Данные игр
let gamesData = [];

// ССЫЛКА НА ВАШ JSON ФАЙЛ - ЗАМЕНИТЕ НА СВОЮ!
const GAMES_JSON_URL = 'https://paste.tc/raw/UNMtUkzj'; // ЗАМЕНИТЕ ЭТУ ССЫЛКУ

// Загрузка данных игр из JSON
async function loadGames() {
    const container = document.getElementById('gamesContainer');
    
    try {
        container.innerHTML = '<div class="loading">Загрузка игр...</div>';
        
        console.log('Загрузка данных из:', GAMES_JSON_URL);
        const response = await fetch(GAMES_JSON_URL);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        gamesData = await response.json();
        console.log('Данные успешно загружены:', gamesData);
        displayGames(gamesData);
        
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        container.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Ошибка загрузки данных</h3>
                <p>${error.message}</p>
                <p style="margin-top: 10px; font-size: 14px;">
                    Проверьте ссылку на JSON файл
                </p>
            </div>
        `;
    }
}

// Отображение карточек игр
function displayGames(games) {
    const container = document.getElementById('gamesContainer');
    
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
                <a href="${game.link}" class="game-link" target="_blank">Установить</a>
            </div>
        </div>
    `).join('');
}

// Функция для форматирования описания
function formatDescription(description) {
    if (Array.isArray(description)) {
        return description.join('<br><br>');
    }
    return description.replace(/\n/g, '<br>');
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

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    setupTheme();
    loadGames();

    // Поиск
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchGames(this.value);
        }, 300);
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchGames(this.value);
        }
    });
});

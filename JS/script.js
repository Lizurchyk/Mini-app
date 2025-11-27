

// URL к вашему buttons.json на GitHub
const GITHUB_JSON_URL = 'https://raw.githubusercontent.com/Lizurchyk/Mini-app/main/buttons.json';

// Тексты для отображения при нажатии на кнопки
const buttonTexts = [
    "Привет! Это первое сообщение!",
    "Отличная работа! Вы нажали на кнопку!",
    "JavaScript работает прекрасно!",
    "Данные загружены из GitHub!",
    "Это демонстрационный текст",
    "Программирование - это весело!",
    "Вы создали интерактивную страницу!",
    "GitHub API в действии!"
];

class ButtonManager {
    constructor() {
        this.buttonsContainer = document.getElementById('buttonsContainer');
        this.output = document.getElementById('output');
        this.buttons = []; // Храним текущий список кнопок
        this.init();
    }

    async init() {
        try {
            await this.loadButtonsFromGitHub();
        } catch (error) {
            this.showError('Ошибка загрузки кнопок: ' + error.message);
        }
    }

    async loadButtonsFromGitHub() {
        this.showLoading('Загрузка кнопок из GitHub...');
        
        const response = await fetch(GITHUB_JSON_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const buttonsData = await response.json();
        this.buttons = buttonsData.buttons; // Сохраняем кнопки
        this.renderButtons();
    }

    renderButtons() {
        this.buttonsContainer.innerHTML = '';
        
        this.buttons.forEach((button, index) => {
            const buttonElement = this.createButtonElement(button, index);
            this.buttonsContainer.appendChild(buttonElement);
        });

        // Показываем сообщение если кнопок нет
        if (this.buttons.length === 0) {
            this.showNoButtonsMessage();
        }
    }

    createButtonElement(button, index) {
        const buttonElement = document.createElement('button');
        buttonElement.textContent = button.name;
        buttonElement.setAttribute('data-index', index);
        buttonElement.addEventListener('click', () => this.handleButtonClick(index));
        
        return buttonElement;
    }

    handleButtonClick(buttonIndex) {
        // Показываем текст
        const randomText = buttonTexts[Math.floor(Math.random() * buttonTexts.length)];
        const timestamp = new Date().toLocaleTimeString();
        const buttonName = this.buttons[buttonIndex].name;
        
        this.output.innerHTML = `
            <strong>${buttonName}</strong><br>
            ${randomText}<br>
            <small>Время нажатия: ${timestamp}</small>
        `;
        
        // Удаляем кнопку из массива
        this.buttons.splice(buttonIndex, 1);
        
        // Перерисовываем кнопки
        this.renderButtons();
        
        // Добавляем анимацию
        this.output.style.animation = 'none';
        setTimeout(() => {
            this.output.style.animation = 'fadeIn 0.5s';
        }, 10);
    }

    showNoButtonsMessage() {
        this.buttonsContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #666;">
                <p>Все кнопки удалены!</p>
                <button onclick="location.reload()" style="margin-top: 10px;">
                    Перезагрузить страницу
                </button>
            </div>
        `;
    }

    showLoading(message) {
        this.buttonsContainer.innerHTML = `<div class="loading">${message}</div>`;
    }

    showError(message) {
        this.buttonsContainer.innerHTML = `
            <div class="error">
                ${message}
                <br><br>
                <button onclick="location.reload()">Попробовать снова</button>
            </div>
        `;
    }
}

// Добавляем CSS анимацию и стили для удаления
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
    }
    
    button {
        transition: all 0.3s ease;
    }
    
    button.removing {
        animation: fadeOut 0.3s ease forwards;
    }
    
    .error button {
        background-color: #dc3545;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
    }
    
    .error button:hover {
        background-color: #c82333;
    }
`;
document.head.appendChild(style);

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new ButtonManager();
});

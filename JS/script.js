// URL к вашему buttons.json на GitHub
const GITHUB_JSON_URL = 'https://raw.githubusercontent.com/Lizurchyk/Mini-app/refs/heads/main/buttons.json';

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
        this.renderButtons(buttonsData.buttons);
    }

    renderButtons(buttons) {
        this.buttonsContainer.innerHTML = '';
        
        buttons.forEach((button, index) => {
            const buttonElement = document.createElement('button');
            buttonElement.textContent = button.name;
            buttonElement.setAttribute('data-index', index);
            buttonElement.addEventListener('click', () => this.handleButtonClick(index));
            
            this.buttonsContainer.appendChild(buttonElement);
        });
    }

    handleButtonClick(buttonIndex) {
        const randomText = buttonTexts[Math.floor(Math.random() * buttonTexts.length)];
        const timestamp = new Date().toLocaleTimeString();
        
        this.output.innerHTML = `
            <strong>Кнопка #${buttonIndex + 1}</strong><br>
            ${randomText}<br>
            <small>Время нажатия: ${timestamp}</small>
        `;
        
        // Добавляем анимацию
        this.output.style.animation = 'none';
        setTimeout(() => {
            this.output.style.animation = 'fadeIn 0.5s';
        }, 10);
    }

    showLoading(message) {
        this.buttonsContainer.innerHTML = `<div class="loading">${message}</div>`;
    }

    showError(message) {
        this.buttonsContainer.innerHTML = `<div class="error">${message}</div>`;
    }
}

// Добавляем CSS анимацию
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new ButtonManager();
});

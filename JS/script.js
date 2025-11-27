// URL к вашему buttons.json на GitHub
const GITHUB_JSON_URL = 'https://raw.githubusercontent.com/Lizurchyk/Mini-app/main/buttons.json';
const GITHUB_API_URL = 'https://api.github.com/repos/Lizurchyk/Mini-app/contents/buttons.json';

// Токен доступа к GitHub API (нужно создать в настройках GitHub)
const GITHUB_TOKEN = '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'; // ЗАМЕНИТЕ на ваш токен

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
        this.buttons = [];
        this.sha = null; // SHA хэш файла для обновления
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
        this.buttons = buttonsData.buttons;
        
        // Получаем информацию о файле для получения SHA
        await this.getFileSHA();
        
        this.renderButtons();
    }

    async getFileSHA() {
        try {
            const response = await fetch(GITHUB_API_URL);
            if (response.ok) {
                const fileInfo = await response.json();
                this.sha = fileInfo.sha;
            }
        } catch (error) {
            console.warn('Не удалось получить SHA файла:', error);
        }
    }

    renderButtons() {
        this.buttonsContainer.innerHTML = '';
        
        this.buttons.forEach((button, index) => {
            const buttonElement = this.createButtonElement(button, index);
            this.buttonsContainer.appendChild(buttonElement);
        });

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

    async handleButtonClick(buttonIndex) {
        const buttonName = this.buttons[buttonIndex].name;
        
        // Показываем текст
        const randomText = buttonTexts[Math.floor(Math.random() * buttonTexts.length)];
        const timestamp = new Date().toLocaleTimeString();
        
        this.output.innerHTML = `
            <strong>${buttonName}</strong><br>
            ${randomText}<br>
            <small>Время нажатия: ${timestamp}</small>
            <div class="updating">Удаляем кнопку из GitHub...</div>
        `;

        try {
            // Удаляем кнопку из массива
            const removedButton = this.buttons.splice(buttonIndex, 1)[0];
            
            // Обновляем файл на GitHub
            await this.updateGitHubFile();
            
            // Перерисовываем кнопки
            this.renderButtons();
            
            this.output.innerHTML = `
                <strong>${buttonName}</strong><br>
                ${randomText}<br>
                <small>Время нажатия: ${timestamp}</small>
                <div class="success">Кнопка успешно удалена из GitHub!</div>
            `;
            
        } catch (error) {
            this.output.innerHTML = `
                <strong>${buttonName}</strong><br>
                ${randomText}<br>
                <small>Время нажатия: ${timestamp}</small>
                <div class="error">Ошибка удаления из GitHub: ${error.message}</div>
            `;
            
            // Возвращаем кнопку обратно в случае ошибки
            this.buttons.splice(buttonIndex, 0, removedButton);
            this.renderButtons();
        }

        // Добавляем анимацию
        this.output.style.animation = 'none';
        setTimeout(() => {
            this.output.style.animation = 'fadeIn 0.5s';
        }, 10);
    }

    async updateGitHubFile() {
        if (!GITHUB_TOKEN || GITHUB_TOKEN === 'your_github_token_here') {
            throw new Error('GitHub токен не настроен. Проверьте GITHUB_TOKEN в коде.');
        }

        const updatedContent = {
            buttons: this.buttons
        };

        const updateData = {
            message: `Remove button from buttons.json`,
            content: btoa(unescape(encodeURIComponent(JSON.stringify(updatedContent, null, 2)))),
            sha: this.sha,
            branch: 'main'
        };

        const response = await fetch(GITHUB_API_URL, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        // Обновляем SHA после успешного обновления
        const responseData = await response.json();
        this.sha = responseData.content.sha;
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

// Добавляем CSS анимацию и стили
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .updating {
        color: #856404;
        background-color: #fff3cd;
        border: 1px solid #ffeaa7;
        padding: 8px;
        border-radius: 4px;
        margin-top: 10px;
        font-size: 14px;
    }
    
    .success {
        color: #155724;
        background-color: #d4edda;
        border: 1px solid #c3e6cb;
        padding: 8px;
        border-radius: 4px;
        margin-top: 10px;
        font-size: 14px;
    }
    
    .error {
        color: #721c24;
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        padding: 8px;
        border-radius: 4px;
        margin-top: 10px;
        font-size: 14px;
    }
    
    .error button {
        background-color: #dc3545;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
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

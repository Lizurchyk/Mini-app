

// Конфигурация приложения
const CONFIG = {
    // Основной канал (открывается при клике на лого)
    MAIN_CHANNEL: {
        name: "SimpleDLC",
        username: "simpledlc",
        photo: "https://img.icons8.com/color/96/000000/controller.png",
        title: "SimpleDLC"
    },
    
    // Каналы для подписки
    SUBSCRIPTION_CHANNELS: [
        {
            name: "@simpledlc",
            username: "simpledlc",
            description: "Основной канал с играми"
        },
        {
            name: "@gameupdates",
            username: "gameupdates", 
            description: "Обновления игр"
        }
    ],
    
    // Токен бота для проверки подписки
    BOT_TOKEN: '5718405917:AAEtLH8r_FEh98utTX7-1iSRBBifbMJ0REY',
    
    // Премиум пользователи
    PREMIUM_USERS: {
        '1439379837': {
            status: 'premium',
            expires: '2025-12-31'
        }
    },
    
    // Игры (без поля price)
    GAMES: [
        {
            name: "[Script] Car Parking Multiplayer",
            description: "Функции: \nНакрутка валют, автоматическая победа в гонках, накрутка статистики, купить любую машину, хром, получить в16, сделать машину полицейской и многое другое\n\nКлюч: \n  tg: @SimpleDLC",
            version: "4.9.5",
            img: "https://f4.bcbits.com/img/a1011463993_16.jpg",
            link: {
                user: "         ",
                premium: "https://www.mediafire.com/file/3381rhnr6fqoqvq/%255BLoader%255D%253DCarParking.SimpleDLC/file"
            }
        },
        {
        name: "[Script] Polywar",
        description: "Функции:\nАим, режим бога, бесконечные патроны и многое другое\n\nКлюч:\n     tg: @SimpleDLC",
        version: "2.5.0",
        img: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2xuz.jpg",
        link: {
                user: "         ",
                premium: "https://www.mediafire.com/file/zyd5g90zjygso7s/%255BLoader%255D%253DPolywar.SimpleDLC/file"
            }

        },
        {
        name: "[Mod] Tomb of the mask",
        description: "Интересная игра с простым геймплеем. Поможет убить время, во время скучного урока или когда нечего делать\n\nФункции:\n• Куплен премиум\n• Отсутствует реклама\n• Двойные монеты\n• Разблокированы все скины\n• Бесконечные сундуки",
        version: "3.0.1",
        img: "https://play-lh.googleusercontent.com/ATGr-U4JBK2VjFzKGK9eMMkrDxJaazadOUoz_7Yl0U5NrWSFcFUzEtNurWXYzVWc8uOO",
        link: {
                user: "",
                premium: "https://t.me/SimpleDLC/377"
            }
        },
        {
        name: "[Script] Counter Flame",
        description: "Интересный шутер, подобии CS 2 на телефоны. В игре доступны: аккаунты, инвентари, к/д, онлайн\n\nФункции:\n• Аим\n• Режим бога\n• Бесконечные патроны\n• Отключение отдачи\n• Быстрая стрельба \n• Дамаг хак\n• Заморозить игроков\n• Магазин хак\n• Флай",
        version: "1.04",
        img: "https://i.ibb.co/gFRQZhXk/IMG-20251128-090350-299.jpg",
            link: {
                user: "https://drive.google.com/cyberpunk-user",
                premium: "https://www.mediafire.com/file/xlfydrj8m02qrrk/%255BLoader%255D%253DCounterFlame.SimpleDLC/file"
            }

        },
    ]
};

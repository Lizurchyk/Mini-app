// Конфигурация приложения
const CONFIG = {
    // Основной канал (открывается при клике на лого)
    MAIN_CHANNEL: {
        name: "SimpleDLC",
        username: "simpledlc",
        photo: "https://img.telemetr.io/c/2DilQY/5350323619592532233?ty=l",
        title: "SimpleDLC"
    },
    
    // Каналы для подписки
    SUBSCRIPTION_CHANNELS: [
        {
            name: "@simpledlc",
            username: "simpledlc",
            description: "Основной канал с играми",
        },
        {
           name: "Fent Cheats",
           username: "FentCheats",
           description: "Лучшие читы на приватки",
        },
    ],
    
    // Токен бота для проверки подписки
    BOT_TOKEN: '5718405917:AAEtLH8r_FEh98utTX7-1iSRBBifbMJ0REY',
    
    // Премиум пользователи
    PREMIUM_USERS: {
        '1439379837': {
            status: 'premium',
            expires: '2024-12-31'
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
                user: "https://go.linkify.ru/2EMN",
                premium: "https://www.mediafire.com/file/3381rhnr6fqoqvq/%255BLoader%255D%253DCarParking.SimpleDLC/file"
            }
        },
        {
            name: "[Mod] Polywar",
            description: "Функции:\n • Бесконечные патроны \n • Нет отдачи \n • Нет разброса пуль \n И многое другое...",
            version: "2.6.0",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ18EPJDQ6RLViyShRkAGR5CU2oNLAsUfU47Lo6pYt3g&s=10",
            link: {
                user: "https://go.linkify.ru/2El9",
                premium: "https://www.mediafire.com/file/fdgte758p1vcxyg/%255BTG_SimpleDLC%255D_Polywar_2.6.0_.apk/file"
            }
        },
        {
            name: "[Mod] Tomb of the mask",
            description: "Интересная игра с простым геймплеем. Поможет убить время, во время скучного урока или когда нечего делать\n\nФункции:\n• Куплен премиум\n• Отсутствует реклама\n• Двойные монеты\n• Разблокированы все скины\n• Бесконечные сундуки",
            version: "3.0.1",
            img: "https://play-lh.googleusercontent.com/ATGr-U4JBK2VjFzKGK9eMMkrDxJaazadOUoz_7Yl0U5NrWSFcFUzEtNurWXYzVWc8uOO",
            link: {
                user: "https://go.linkify.ru/2EMP",
                premium: "https://t.me/SimpleDLC/377"
            }
        },
        {
            name: "[Script] Counter Flame",
            description: "Интересный шутер, подобии CS 2 на телефоны. В игре доступны: аккаунты, инвентари, к/д, онлайн\n\nФункции:\n• Аим\n• Режим бога\n• Бесконечные патроны\n• Отключение отдачи\n• Быстрая стрельба \n• Дамаг хак\n• Заморозить игроков\n• Магазин хак\n• Флай",
            version: "1.05",
            img: "https://i.ibb.co/gFRQZhXk/IMG-20251128-090350-299.jpg",
            link: {
                user: "https://go.linkify.ru/2EQp",
                premium: "https://www.mediafire.com/file/xdh7rccdsbepn61/%255BLoader%255D%253DCounterFlame.SimpleDLC/file"
            }
        },
        {
            name: "[Mod] Roblox",
            description: "Roblox – это невероятная виртуальная вселенная для творчества, общения с друзьями и воплощения всех ваших фантазий. Присоединитесь к миллионам других людей и погрузитесь в невероятное многообразие миров, создаваемых мировым сообществом!\n\n\nОсобенности: Мод-меню",
            version: "2.690.721",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTHmNKSghjjLSRNof-U9A_pVgBOfMSORyQv72rNuXbww&s=10",
            link: {
                user: "https://go.linkify.ru/2EMZ",
                premium: "https://www.mediafire.com/file/ys0x74t9uk1rmt8/Roblox-2.690.721-Menu_20cheatsM.apk/file"
            }
        },
        {
            name: "[Script] StandLeo",
            description: "Функции: \n• Аим \n• Режим бога \n• Бесконечные патроны \n• Быстрая стрельба \n• Нет отдачи \n• И многое другое...\n\n\nКлюч: tg: @SimpleDLC",
            version: "3.1",
            img: "https://androidprog.com/wp-content/uploads/2023/04/standleo.webp",
            link: {
                user: "https://go.linkify.ru/2EQj",
                premium: "https://www.mediafire.com/file/ftwapnguye8ylm7/%255BLoader%255D%253DStandLeo.SimpleDLC/file"
            }
        },
        {
            name: "[Mod] StandLeo Lite",
            description: "Функции: \n• Аим \n• Вх \n• Бесконечные патроны \n• Анти гранаты \n• Нет отдачи \n• И многое другое...",
            version: "1.1",
            img: "https://online-games-free.ru/wp-content/uploads/2025/10/standleo-lite.jpg",
            link: {
                user: "https://go.linkify.ru/2Egi",
                premium: "https://www.mediafire.com/file/nta7lxdkew2mb3b/%255BMOD%255D_STANDLEO_LITE_BY_TG_%2540SimpleDLC.apk/file"
            }
        },
        {
            name: "[Mod] Car parking multiplayer",
            description: "Функции: \n • ОТСУТСТВУЕТ БАН СЕРВЕР \n • 50.000 коинов \n • Бесконечные деньги \n • На всех машинах W16\n • Бесконечный бензин \n • И многое другое...",
            version: "4.9.6",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFLg80VlMJANIGWk22vy8qMNA5sP5XucnSHE3qwYQMikZ8UO3-jvOSrup0&s=10",
            link: {
                user: "https://go.linkify.ru/2EeB",
                premium: "https://www.mediafire.com/file/0097yrq65x85jke/base.apk/file"
            }
        },
      {
            name: "[Mod] StandLeo",
            description: "Функции: \n• Аим \n• Анти гранаты \n• Бесконечные патроны \n• Быстрая стрельба \n• Нет отдачи \n• И многое другое...\n\n\nКлюч: t.me/SimpleDLC",
            version: "3.1",
            img: "https://androidprog.com/wp-content/uploads/2023/04/standleo.webp",
            link: {
                user: "https://go.linkify.ru/2Ei1",
                premium: "https://www.mediafire.com/file/1eh3v8colgke34s/%25D0%2590%25D0%259F%25D0%259A_%25D0%25A7%25D0%2598%25D0%25A2_STANDLEO_3.1.zip/file"
            }
        },





    ]
};
// Конфигурация приложения
const CONFIG = {
    // Основной канал (открывается при клике на лого)
    MAIN_CHANNEL: {
        name: "SimpleDLC",
        username: "simpledlc",
        photo: "https://img.telemetr.io/c/2DilQY/5395316193750618010?ty=l",
        title: "SimpleDLC"
    },
    
    // Каналы для подписки
    SUBSCRIPTION_CHANNELS: [
        {
            name: "@simpledlc",
            username: "simpledlc",
            description: "Основной канал с играми",
        },
 
    ],
    
    // Токен бота для проверки подписки
    BOT_TOKEN: '5718405917:AAEtLH8r_FEh98utTX7-1iSRBBifbMJ0REY',
    
    // Премиум пользователи
    PREMIUM_USERS: {
        '1439379837': {
            status: 'premium',
            expires: '2026-12-31'
        }
    },
    
    // Игры (без поля price)
    GAMES: [
      {
            name: "[Mod] StandChillow V2",
            description: "Функции: • Аим \n • Есп \n • Чамсы \n • Invisible \n • No clip \n • И многое другое ...",
            version: "1.6",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSudvIrh_-rEUazN8IwpIkzjgCjDDE2VyZZsuXwWTQKf1Zknfc5tGMPvmQ&s=10",
            link: {
                user: "https://go.linkify.ru/2FN4",
                premium: "https://mega.nz/file/eUUy0ZqY#MFRMdzXqTtlcrjoQtX3zNKnhR3EacXyYM4HiE3LfRnw"
            }
        },
        {
            name: "[Mod] StandChillow",
            description: "Функции: • Аим \n • Есп \n • Чамсы \n • И другое ...",
            version: "1.6",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSudvIrh_-rEUazN8IwpIkzjgCjDDE2VyZZsuXwWTQKf1Zknfc5tGMPvmQ&s=10",
            link: {
                user: "https://go.linkify.ru/2EpH",
                premium: "https://www.mediafire.com/file/um0skqps6q15l3b/%255BTG_SimpleDLC%255D_StandChillow_1.6._.apk/file"
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
            name: "[Script] StandLeo",
            description: "Функции: \n• Аим \n• Режим призрака \n• Изменить спавн \n• Бесконечные патроны \n• Нет отдачи \n• И многое другое...\n\n\nКлюч: tg: @SimpleDLC",
            version: "3.2F1",
            img: "https://androidprog.com/wp-content/uploads/2023/04/standleo.webp",
            link: {
                user: "https://go.linkify.ru/2FQb",
                premium: "https://mega.nz/file/Pck3XBwA#FuVA1VRb8UF6Bmd07TTPY_f1FHBHXIW1jlg2bzqsu4o"
            }
        },
        {
            name: "[Mod] StandLeo Lite",
            description: "Функции: \n• Вх \n• Анти гранаты \n• Нет отдачи \n• И многое другое...",
            version: "1.2",
            img: "https://online-games-free.ru/wp-content/uploads/2025/10/standleo-lite.jpg",
            link: {
                user: "https://go.linkify.ru/2FAH",
                premium: "https://mega.nz/file/aUMn0ZyA#GTQ7Mjqizgg6pfE1U2MhGSQ7Y3V2LMFU8aPUJu3n118"
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
      {
            name: "[Mod] Polywar",
            description: "Функции: \n• Режим бога \n• Анти гранаты \n• Бесконечные патроны \n• Быстрая стрельба \n• Нет отдачи \n• И многое другое...",
            version: "2.6.0",
            img: "https://play-lh.googleusercontent.com/uccdbLxCVw3rh-dDDnpKQ9If1cCyHhLkn_k0ovSuk_VDRxXz8yPHbw1azJztqCbAQA=w240-h480-rw",
            link: {
                user: "https://go.linkify.ru/2F6Q",
                premium: "https://mega.nz/file/2N12yCAS#cMMYFxafw6WLm1jXkNwIwmJybFBSfonYMI-G5ClYXkI"
            }
        },
      {
            name: "[Mod] StandLeo Classic",
            description: "Функции: \n• Мини аим \n• Анти гранаты \n• Бесконечные патроны \n• Вх \n• Радар хак",
            version: "1.0",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVOvuvVFtmo-FyD27MbNLryfVx0DP1JYMWruh2LISBjCHywxjH9BQlfF0&s=10",
            link: {
                user: "https://go.linkify.ru/2FDd",
                premium: "https://mega.nz/file/2EkDXCLR#2BhYutXnvRAlOJgoo3DyCcL4SH2qmpcdXhR4XcTZRJY"
            }
        },
      {
            name: "[Script] StandLeo Classic",
            description: "Функции: \n• Аим \n• Аим в2 \n• Анти гранаты \n• Бесконечные патроны \n• Нет отдачи \n• Радар хак \n• И другое ...",
            version: "1.0",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVOvuvVFtmo-FyD27MbNLryfVx0DP1JYMWruh2LISBjCHywxjH9BQlfF0&s=10",
            link: {
                user: "https://go.linkify.ru/2FFj",
                premium: "https://mega.nz/file/aYEkiZDD#7QNPBsI3v83sP96ZAC-gVipKRfsTsqqjX9SjeaUyBAA"
            }
        },

      {
            name: "[Script] Car parking multiplayer",
            description: "Функции: \n• Накрутка денег \n• Накрутка монет \n• Покупка любых авто \n• И другое ...",
            version: "4.9.6",
            img: "https://www.metacritic.com/a/img/resize/5a720b702ac5712938caef5ec3f328a373172da8/catalog/provider/6/12/6-1-828593-59.jpg?auto=webp&fit=crop&height=675&width=1200",
            link: {
                user: "https://go.linkify.ru/2FI0",
                premium: "https://mega.nz/file/rZNUiZLL#cRRmCCNSGxKfOfPeLybvZIZpanJfrNiJLxYRm7ZY9QI"
            }
        },





    ]
};
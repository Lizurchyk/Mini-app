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
            name: "Читы на игры",
            username: "https://t.me/+MyUkrVP_q5E3YzM6",
            chat_id: "@SimpleDLC",
            description: "Основной канал с играми",
        },
 
 
    ],
    
    // Токен бота для проверки подписки
    BOT_TOKEN: '5718405917:AAEtLH8r_FEh98utTX7-1iSRBBifbMJ0REY',
    
    // Премиум пользователи
    PREMIUM_USERS: {
        '1439379837': {
            status: 'premium',
            expires: '2025-12-30'
        }
    },
    
    // Игры (без поля price) 
    GAMES: [
      {
            name: "[Mod] StandChillow V3",
            description: "Функции:\n • Аим \n • Есп \n • Чамсы \n • Invisible \n • No clip \n • И многое другое ...",
            version: "1.6",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSudvIrh_-rEUazN8IwpIkzjgCjDDE2VyZZsuXwWTQKf1Zknfc5tGMPvmQ&s=10",
            link: {
                user: "https://go.linkify.ru/2FxS",
                premium: "https://mega.nz/file/DFUgiSRD#NjbBtENjys-Dzejg2uZnITWHInzCvgq4joaZA8r0ilI"
            }
        },
      {
            name: "[Script] Standoff",
            description: "Функции:\n • No recoil\n • Anti Grenade\n • Fov\n • Chams",
            version: "0.37.0",
            img: "https://i.ytimg.com/vi/PET3rLiRPD8/mqdefault.jpg",
            link: {
                user: "https://go.linkify.ru/2G2P",
                premium: "https://mega.nz/file/yNkTXAwY#BlnGfG8S2GDi0S3XRBp2vMdX4jIgfDsxKxM_Gy-jcUE"
            }
        },
        {
            name: "[Mod] StandChillow",
            description: "Функции:\n • Аим \n • Есп \n • Чамсы \n • И другое ...",
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
                user: "https://go.linkify.ru/2G06",
                premium: "https://mega.nz/file/Pck3XBwA#FuVA1VRb8UF6Bmd07TTPY_f1FHBHXIW1jlg2bzqsu4o"
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
            name: "[Script] Car parking multiplayer",
            description: "Функции: \n• Накрутка денег \n• Накрутка монет \n• Накрутка статистики \n• И другое ...",
            version: "4.9.7",
            img: "https://www.metacritic.com/a/img/resize/5a720b702ac5712938caef5ec3f328a373172da8/catalog/provider/6/12/6-1-828593-59.jpg?auto=webp&fit=crop&height=675&width=1200",
            link: {
                user: "https://go.linkify.ru/2FzI",
                premium: "https://mega.nz/file/PE1D1TAR#-XzISLpcrpc5liHz9aQtZKhLEOBRea0HVzi23A7iYio"
            }
        },
{

            name: "[Mod] Polyfield",
            description: "Функции: \n• Бессмертие \n• Накрутка патронов \n• Хак скорости \n• Быстрая стрельба \n• И другое ...",
            version: "0.7.3",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL4X2tC8PhICMiRCyjWLrJo5sNgcdwgh2L-zawVIWx3w&s=10",
            link: {
                user: "https://go.linkify.ru/2Fpz",
                premium: "https://mega.nz/file/GBlj2S4a#klMsG_VQJaooq3VxVY4ViKiG95RHyJ1AqvhWsE5qC9c"
            }
        },





    ]
};
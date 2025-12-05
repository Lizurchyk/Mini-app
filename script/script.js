// Конфигурация приложения
const CONFIG = {
    // Основной канал (открывается при клике на лого)
    MAIN_CHANNEL: {
        name: "SimpleDLC",
        username: "simpledlc", // Без @
        photo: "https://img.icons8.com/color/96/000000/controller.png", // Фото канала
        title: "SimpleDLC" // Название в лого
    },
    
    // Каналы для подписки (указываются отдельно)
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
    
    // Игры
    GAMES: [
        {
            id: 1,
            name: "Minecraft",
            price: 1999,
            oldPrice: 2499,
            image: "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/02/minecraft-key-art-feature.jpg",
            description: "Песочница с кубической графикой",
            version: "1.20",
            category: "sandbox",
            tags: ["популярная", "песочница"],
            downloadLinks: {
                free: "https://drive.google.com/minecraft-free",
                premium: "https://drive.google.com/minecraft-premium"
            }
        },
        {
            id: 2,
            name: "GTA V",
            price: 2999,
            oldPrice: 3499,
            image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2xuz.jpg",
            description: "Криминальная сага в Лос-Сантосе",
            version: "Premium",
            category: "action",
            tags: ["экшен", "открытый мир"],
            downloadLinks: {
                free: "https://drive.google.com/gtav-free",
                premium: "https://drive.google.com/gtav-premium"
            }
        },
        {
            id: 3,
            name: "CS:GO",
            price: 0,
            oldPrice: 1499,
            image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co49w5.jpg",
            description: "Тактический шутер",
            version: "Free",
            category: "fps",
            tags: ["бесплатная", "шутер"],
            downloadLinks: {
                free: "https://store.steampowered.com/app/730/CSGO/",
                premium: "https://drive.google.com/csgo-premium"
            }
        },
        {
            id: 4,
            name: "Cyberpunk 2077",
            price: 3999,
            oldPrice: null,
            image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2g0y.jpg",
            description: "Ролевая игра в будущем",
            version: "2.0",
            category: "rpg",
            tags: ["RPG", "футуристика"],
            downloadLinks: {
                free: "https://drive.google.com/cyberpunk-free",
                premium: "https://drive.google.com/cyberpunk-premium"
            }
        },
        {
            id: 5,
            name: "The Witcher 3",
            price: 1499,
            oldPrice: 2999,
            image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7c.jpg",
            description: "Фэнтези РПГ про ведьмака",
            version: "Complete",
            category: "rpg",
            tags: ["фэнтези", "RPG"],
            downloadLinks: {
                free: "https://drive.google.com/witcher-free",
                premium: "https://drive.google.com/witcher-premium"
            }
        }
    ]
};

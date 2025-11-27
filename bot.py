from flask import Flask, request, jsonify
import requests
import logging
from typing import List, Dict, Optional

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

class TelegramBot:
    def __init__(self, token: str):
        self.token = token
        self.base_url = f"https://api.telegram.org/bot{token}"
    
    def get_chat_member(self, chat_id: str, user_id: int) -> Optional[Dict]:
        """Проверяет статус пользователя в чате/канале"""
        url = f"{self.base_url}/getChatMember"
        data = {
            'chat_id': chat_id,
            'user_id': user_id
        }
        
        try:
            response = requests.post(url, json=data, timeout=10)
            result = response.json()
            
            if result.get('ok'):
                return result.get('result')
            else:
                logging.error(f"Error getting chat member: {result}")
                return None
                
        except Exception as e:
            logging.error(f"Exception in get_chat_member: {e}")
            return None
    
    def get_chat(self, chat_id: str) -> Optional[Dict]:
        """Получает информацию о чате/канале"""
        url = f"{self.base_url}/getChat"
        data = {'chat_id': chat_id}
        
        try:
            response = requests.post(url, json=data, timeout=10)
            result = response.json()
            
            if result.get('ok'):
                return result.get('result')
            else:
                logging.error(f"Error getting chat: {result}")
                return None
                
        except Exception as e:
            logging.error(f"Exception in get_chat: {e}")
            return None

# Инициализация бота (ЗАМЕНИ НА СВОЙ ТОКЕН)
BOT_TOKEN = "YOUR_BOT_TOKEN_HERE"
bot = TelegramBot(BOT_TOKEN)

# Список каналов для проверки (ЗАМЕНИ НА СВОИ КАНАЛЫ)
CHANNELS_TO_CHECK = [
    {"id": "@SimpleDLX", "name": "Simple dlc"},
    {"id": "@telegram", "name": "Telegram News"},
    {"id": "@technews", "name": "Tech News"},
    {"id": "@python", "name": "Python Programming"},
]

def check_user_subscriptions(user_id: int) -> List[Dict]:
    """Проверяет подписки пользователя на все каналы"""
    subscriptions = []
    
    for channel in CHANNELS_TO_CHECK:
        chat_info = bot.get_chat(channel['id'])
        member_info = bot.get_chat_member(channel['id'], user_id)
        
        if member_info and chat_info:
            status = member_info.get('status', 'left')
            is_subscribed = status in ['creator', 'administrator', 'member']
            
            subscription_data = {
                'id': chat_info.get('id'),
                'title': chat_info.get('title', channel['name']),
                'username': chat_info.get('username'),
                'is_subscribed': is_subscribed,
                'status': status,
                'members_count': chat_info.get('members_count', 0)
            }
            
            subscriptions.append(subscription_data)
        else:
            # Если не удалось получить информацию
            subscriptions.append({
                'id': channel['id'],
                'title': channel['name'],
                'username': channel['id'].replace('@', ''),
                'is_subscribed': False,
                'status': 'error',
                'members_count': 0
            })
    
    return subscriptions

@app.route('/api/check_subscriptions', methods=['POST'])
def check_subscriptions():
    """API endpoint для проверки подписок"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400
        
        subscriptions = check_user_subscriptions(user_id)
        
        return jsonify({
            'success': True,
            'user_id': user_id,
            'subscriptions': subscriptions,
            'total_subscribed': len([s for s in subscriptions if s['is_subscribed']]),
            'total_channels': len(subscriptions)
        })
        
    except Exception as e:
        logging.error(f"Error in check_subscriptions: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/get_channels', methods=['GET'])
def get_channels():
    """API endpoint для получения списка каналов"""
    return jsonify({
        'channels': CHANNELS_TO_CHECK,
        'total': len(CHANNELS_TO_CHECK)
    })

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

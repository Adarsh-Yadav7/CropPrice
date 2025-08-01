from flask import Flask, jsonify, request
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

API_KEY = "ade15208349440759c397f57935b64f1"
BASE_URL = "https://newsapi.org/v2/everything"

@app.route('/real-time-news', methods=['GET'])
def get_real_time_news():
    query = request.args.get('query', 'agriculture')  # Default to 'agriculture'
    page_size = int(request.args.get('page_size', 8))  # Top 8 news
    country = 'in'  # Focus on India (used in query for relevance)

    try:
        response = requests.get(
            BASE_URL,
            params={
                'apiKey': API_KEY,
                'q': f'{query} AND India',   # Filter news containing agriculture + India
                'language': 'en',
                'pageSize': page_size,
                'sortBy': 'publishedAt'
            }
        )

        if response.status_code == 200:
            data = response.json()
            if 'articles' not in data or not data['articles']:
                return jsonify({'error': 'No news found'}), 404

            articles = [
                {
                    'title': article['title'],
                    'description': article['description'],
                    'url': article['url'],
                    'published_at': article['publishedAt'],
                    'source': article['source']['name'],
                }
                for article in data['articles']
            ]
            return jsonify({'news': articles})
        else:
            return jsonify({'error': f"Status Code: {response.status_code}"}), 500

    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=7070)

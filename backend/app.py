from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "https://linkcheckr.vercel.app"])

@app.route('/check-links', methods=['POST'])
def check_links():
    data = request.json
    url = data.get('url')
    
    if not url:
        return jsonify({"error": "URL is required"}), 400
    
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        links = [a['href'] for a in soup.find_all('a', href=True)]
        
        broken_links = []
        for link in links:
            try:
                res = requests.head(link, timeout=5)
                if res.status_code >= 400:
                    broken_links.append({"url": link, "status": res.status_code})
            except:
                broken_links.append({"url": link, "status": "Unknown"})
        
        return jsonify({
            "total_links": len(links),
            "broken_links": broken_links
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
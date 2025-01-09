from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import time
from urllib.parse import urljoin, urlparse
import logging

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "https://linkcheckr.vercel.app"]}})
logging.basicConfig(level=logging.INFO)

def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    return webdriver.Chrome(options=chrome_options)

def is_valid_url(url):
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False

def normalize_url(base_url, link):
    try:
        if not link:
            return None
        # Handle mailto: and tel: links
        if link.startswith(('mailto:', 'tel:', 'javascript:')):
            return None
        # Handle relative URLs
        if not urlparse(link).netloc:
            return urljoin(base_url, link)
        return link
    except:
        return None

def check_link_status(url, timeout=5):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.head(url, timeout=timeout, headers=headers, allow_redirects=True)
        if response.status_code == 405: # Method not allowed
            response = requests.get(url, timeout=timeout, headers=headers, allow_redirects=True)
        return response.status_code
    except requests.exceptions.RequestException:
        return "Unknown"

@app.route('/check-links', methods=['POST'])
def check_links():
    data = request.json
    url = data.get('url')
    wait_time = data.get('wait_time', 5)  # Time to wait for dynamic content
    
    if not url:
        return jsonify({"error": "URL is required"}), 400
    
    if not is_valid_url(url):
        return jsonify({"error": "Invalid URL provided"}), 400
    
    driver = None
    try:
        driver = setup_driver()
        logging.info(f"Checking links for: {url}")
        
        # Load the page and wait for dynamic content
        driver.get(url)
        time.sleep(wait_time)  # Wait for dynamic content to load
        
        # Get page source after JavaScript execution
        page_source = driver.page_source
        soup = BeautifulSoup(page_source, 'html.parser')
        
        # Find all links
        raw_links = soup.find_all('a', href=True)
        
        # Process and normalize links
        links = []
        for link in raw_links:
            normalized_url = normalize_url(url, link['href'])
            if normalized_url and is_valid_url(normalized_url):
                links.append(normalized_url)
        
        # Remove duplicates while preserving order
        links = list(dict.fromkeys(links))
        
        # Check each link
        broken_links = []
        working_links = []
        
        for link in links:
            status = check_link_status(link)
            link_info = {"url": link, "status": status}
            
            if isinstance(status, str) or status >= 400:
                broken_links.append(link_info)
            else:
                working_links.append(link_info)
        
        result = {
            "url_checked": url,
            "total_links": len(links),
            "working_links": working_links,
            "broken_links": broken_links,
            "summary": {
                "total": len(links),
                "working": len(working_links),
                "broken": len(broken_links)
            }
        }
        
        logging.info(f"Completed checking {len(links)} links for {url}")
        return jsonify(result)
    
    except Exception as e:
        logging.error(f"Error checking links: {str(e)}")
        return jsonify({"error": str(e)}), 500
        
    finally:
        if driver:
            driver.quit()

if __name__ == '__main__':
    app.run(debug=True)
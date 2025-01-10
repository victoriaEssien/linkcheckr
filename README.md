# LinkCheckr

LinkCheckr is a web application for verifying the status of all links on a given webpage. It checks for broken or inaccessible links and provides a summary report, making it an essential tool for web developers, SEO specialists, and website administrators.

---

![Screenshot (279)](https://github.com/user-attachments/assets/8677188b-1562-4c85-bd44-7dc12a5a70ac)

---

## Why LinkCheckr?

- **Efficient Link Validation:** Automatically scans webpages and checks the status of every link.  
- **User-Friendly Interface:** Clear categorization of working and broken links with easy navigation.  
- **Dynamic Content Handling:** Uses Selenium to render JavaScript-heavy pages for accurate link extraction.  
- **Restricted Domain Awareness:** Warns users about domains that block automated link checking.

---

## Features

- Verifies links dynamically loaded via JavaScript.  
- Provides summaries of total, working, and broken links.  
- Highlights links from restricted domains like LinkedIn or X (formerly Twitter).  
- Offers a clean, responsive interface for URL submission and results display.

---

## Getting Started

Follow these steps to set up and run LinkCheckr on your local machine.

---

### Prerequisites

1. **Frontend:**  
   - Node.js installed ([Download Node.js](https://nodejs.org/))
   - A modern web browser.

2. **Backend:**  
   - Python 3.7 or higher installed ([Download Python](https://www.python.org/))
   - Google Chrome and ChromeDriver installed ([Install ChromeDriver](https://sites.google.com/chromium.org/driver/)).

---

### Installation and Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/victoriaEssien/linkcheckr.git
   cd linkcheckr
   ```

2. **Frontend Setup:**
   - Navigate to the `frontend` directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create an `.env` file in the `frontend` directory with your API base URL:
     ```env
     VITE_API_BASE_URL=http://localhost:5000
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```

3. **Backend Setup:**
   - Navigate to the `backend` directory:
     ```bash
     cd backend
     ```
   - Create a virtual environment:
     ```bash
     python -m venv venv
     source venv/bin/activate  # On Windows: venv\Scripts\activate
     ```
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Run the Flask server:
     ```bash
     python app.py
     ```

---

### Running the Application

1. Start the backend server:
   ```bash
   python app.py
   ```
   This starts the Flask API server at `http://localhost:5000`.

2. Start the frontend:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

3. Open the application in your browser and enter a URL to check its links.

---

### Technologies Used

- **Frontend:** React, Vite, TailwindCSS, Lucide Icons  
- **Backend:** Flask, Selenium, BeautifulSoup, Requests  
- **Database/State:** In-memory processing  

---

### Notes

- Ensure ChromeDriver is compatible with your installed version of Google Chrome.  
- Restricted domains like LinkedIn and Twitter prevent automated link checking.  
- Adjust the `wait_time` parameter in `app.py` for sites with slow dynamic content loading.

---

### Contribution

Feel free to fork this repository and make your own modifications. Contributions are welcome! Submit a pull request for review.

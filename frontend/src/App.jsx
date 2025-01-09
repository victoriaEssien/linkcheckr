import { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/check-links`, { url });
      setResults(response.data);
    } catch (err) {
      console.error("Error checking links:", err);
    }
  };

  return (
    <div>
      <h1>Broken Link Checker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter your site URL"
          required
        />
        <button type="submit">Check Links</button>
      </form>
      {results && (
        <div>
          <p>Total Links: {results.total_links}</p>
          <h2>Broken Links:</h2>
          <ul>
            {results.broken_links.map((link, index) => (
              <li key={index}>
                {link.url} - Status: {link.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
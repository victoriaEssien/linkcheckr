import { useState } from "react";
import { Loader2, AlertCircle, ExternalLink } from "lucide-react";

// List of domains that commonly block automated checking
const RESTRICTED_DOMAINS = ["linkedin.com", "x.com", "twitter.com"];

// Helper function to extract domain from URL
const getDomain = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

// Helper to check if URL is from a restricted domain
const isRestrictedDomain = (url) => {
  return RESTRICTED_DOMAINS.some((domain) =>
    url.toLowerCase().includes(domain)
  );
};

export default function App() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/check-links`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to check links");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || "An error occurred while checking links");
      console.error("Error checking links:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderLinkStatus = (link) => {
    if (isRestrictedDomain(link.url)) {
      return (
        <div className="text-sm text-yellow-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          Cannot verify (restricted domain)
        </div>
      );
    }
    return <div className="text-sm text-red-600">Status: {link.status}</div>;
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            LinkCheckr
          </h1>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter your site URL (e.g., https://example.com)"
                required
                className="px-4 py-2.5 border border-gray-300 w-full md:w-8/12 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Checking..." : "Check Links"}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center text-gray-600">
              Scanning website for links... This may take a few moments.
            </div>
          )}

          {results && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg shadow">
                  <div className="text-xl font-semibold text-gray-900">
                    {results.summary.total}
                  </div>
                  <div className="text-sm text-gray-600">Total Links</div>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                  <div className="text-xl font-semibold text-green-600">
                    {results.summary.working}
                  </div>
                  <div className="text-sm text-gray-600">Working Links</div>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                  <div className="text-xl font-semibold text-red-600">
                    {results.summary.broken}
                  </div>
                  <div className="text-sm text-gray-600">Broken Links</div>
                </div>
              </div>

              {results.broken_links.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Broken Links</h2>
                  <div className="space-y-3">
                    {results.broken_links.map((link, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          isRestrictedDomain(link.url)
                            ? "bg-yellow-50 border border-yellow-100"
                            : "bg-red-50 border border-red-100"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-medium text-gray-800 break-all">
                            {link.url}
                          </div>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                        {renderLinkStatus(link)}
                        {isRestrictedDomain(link.url) && (
                          <div className="mt-2 text-sm text-gray-600">
                            Links from {getDomain(link.url)} cannot be
                            automatically verified. Please check manually.
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.working_links.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Working Links</h2>
                  <div className="space-y-3">
                    {results.working_links.map((link, index) => (
                      <div
                        key={index}
                        className="p-3 bg-green-50 border border-green-100 rounded-lg"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-medium text-green-800 break-all">
                            {link.url}
                          </div>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                        <div className="text-sm text-green-600">
                          Status: {link.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="bg-[#F9FAFB] sticky bottom-0 left-0 right-0 z-20 mx-auto text-center py-4">
        <p className="text-[#a3b3c2]">
          Developed by{" "}
          <a
            href="https://victoriaessien.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Victoria Essien
          </a>
        </p>
      </div>
    </>
  );
}

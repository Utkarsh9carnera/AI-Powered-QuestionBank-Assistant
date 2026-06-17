import { useState } from "react";
import axios from "axios";

function Dashboard() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);

      const response = await axios.get(
        `https://ai-powered-questionbank-assistant.onrender.com/api/questions/search?query=${query}`
      );

      setAnswer(response.data.answer);
    } catch (error) {
      console.error(error);
      setAnswer("Error fetching answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>AI Question Bank Assistant</h1>

      <input
        type="text"
        placeholder="Ask anything..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={handleSearch}>
        {loading ? "Searching..." : "Search"}
      </button>

      {answer && (
        <div style={{ marginTop: "20px" }}>
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
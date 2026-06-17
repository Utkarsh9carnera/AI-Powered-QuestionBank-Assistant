import { useState } from "react";
import axios from "axios";

function Dashboard() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        "https://ai-powered-questionbank-assistant.onrender.com/api/questions/search",
        {
          params: { query }
        }
      );

      if (response.data.answer) {
        setResult(response.data.answer);
      } else {
        setResult("No answer found.");
      }
    } catch (error) {
      console.error(error);
      setResult("Error fetching answer.");
    }
  };

  return (
    <div className="dashboard">
      <div className="search-card">

        <h1>AI Question Bank Assistant</h1>

        <div className="search-box">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything..."
          />

          <button onClick={handleSearch}>
            Search
          </button>
        </div>

        {result && (
          <div className="answer-box">
            <h2>Answer</h2>
            <p>{result}</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;
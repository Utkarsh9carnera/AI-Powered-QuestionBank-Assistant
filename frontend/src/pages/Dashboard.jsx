import { useState } from "react";
import axios from "axios";

function Dashboard() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [source, setSource] = useState("");

  const sampleQuestions = [
    "What is React?",
    "What is AWS?",
    "What is SQL?",
    "What is Machine Learning?",
    "Who is Cristiano Ronaldo?"
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await axios.get(
        `https://ai-powered-questionbank-assistant.onrender.com/api/AIApi/ask?query=${encodeURIComponent(query)}`
      );

      setResult(response.data.answer);
      setSource(response.data.source);
    } catch (error) {
      console.error(error);
      setResult("Error fetching answer");
      setSource("");
    }
  };

  return (
    <div className="dashboard">

      <div className="search-card">

        <h1>AI Question Bank Assistant</h1>

        <p className="subtitle">
          Search your Question Bank or get answers from AI.
        </p>

        <div className="guide-box">
          <h3>How To Use</h3>

          <ul>
            <li>Add your own questions using Add Question.</li>
            <li>Search from your Question Bank.</li>
            <li>If no match is found, AI will generate an answer.</li>
          </ul>
        </div>

        <div className="sample-section">
          <h3>Try These Questions</h3>

          <div className="sample-buttons">
            {sampleQuestions.map((item, index) => (
              <button
                key={index}
                className="sample-btn"
                onClick={() => setQuery(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Ask anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          <button onClick={handleSearch}>
            Search
          </button>
        </div>

        {result && (
          <div className="answer-box">

            <h2>Answer</h2>

            {source && (
              <p className="source">
                Source: {source}
              </p>
            )}

            <p>{result}</p>

          </div>
        )}

      </div>

    </div>
  );
}

export default Dashboard;
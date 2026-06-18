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
        `https://ai-powered-questionbank-assistant.onrender.com/api/AIApi/ask?query=${encodeURIComponent(
          query
        )}`
      );

      const cleanAnswer = response.data.answer
        ?.replace(/\*\*/g, "")
        ?.replace(/#{1,6}/g, "")
        ?.replace(/={2,}/g, "")
        ?.replace(/-{2,}/g, "")
        ?.replace(/\n{3,}/g, "\n\n");

      setResult(cleanAnswer);
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
          Search your Question Bank or get answers from AI
        </p>

        <div className="guide-box">
          <h3>How It Works</h3>

          <div className="steps">

            <div className="step">
              <span>➊</span>
              Add Questions
            </div>

            <div className="step">
              <span>➋</span>
              Search Question Bank
            </div>

            <div className="step">
              <span>➌</span>
              AI answers if no match is found
            </div>

          </div>
        </div>

        <h3 className="popular-title">
          Popular Questions
        </h3>

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
import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function Dashboard() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5199/api/ai/ask",
        {
          question: question,
        }
      );

      setAnswer(response.data.answer || "");
      setSource(response.data.source || "");
    } catch (error) {
      console.error(error);
      alert("Failed to get answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="title">
          AI Question Bank Assistant
        </h1>

        <p className="subtitle">
          Ask questions from your Question Bank
        </p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Ask anything..."
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                askAI();
              }
            }}
          />

          <button onClick={askAI}>
            {loading
              ? "🔍 Searching..."
              : "Search"}
          </button>
        </div>

        {answer && (
          <div className="answer-card">
            <h2>Answer</h2>

            <div className="source-wrapper">
              <span className="source-badge">
                {source}
              </span>
            </div>

            <div className="answer-content">
              <ReactMarkdown>
                {answer}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
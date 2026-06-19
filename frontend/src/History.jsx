import { useEffect, useState } from "react";
import axios from "axios";

function History() {
  const [history, setHistory] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const response = await axios.get(
        `https://ai-powered-questionbank-assistant.onrender.com/api/AIApi/history?userEmail=${user.email}`
      );

      setHistory(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const clearHistory = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      await axios.delete(
        `https://ai-powered-questionbank-assistant.onrender.com/api/AIApi/history/${user.email}`
      );

      setHistory([]);
    } catch (error) {
      console.error(error);
      alert("Failed to clear history");
    }
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "50px auto",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "700",
          }}
        >
          Search History
        </h1>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            style={{
              background: "#ff4d6d",
              border: "none",
              color: "white",
              padding: "12px 20px",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            🗑 Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div
          style={{
            background: "#1f275f",
            padding: "30px",
            borderRadius: "15px",
          }}
        >
          <h3>No searches found.</h3>
        </div>
      ) : (
        history.map((item) => {
          const isExpanded =
            expandedId === item.id;

          const shortAnswer =
            item.answer?.split(" ").slice(0, 8).join(" ") +
            "...";

          return (
            <div
              key={item.id}
              onClick={() =>
                setExpandedId(
                  isExpanded ? null : item.id
                )
              }
              style={{
                background: "#1f275f",
                padding: "25px",
                borderRadius: "18px",
                marginBottom: "20px",
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              <h2
                style={{
                  marginBottom: "10px",
                }}
              >
                {item.question}
              </h2>

              <p
                style={{
                  color: "#d6d6d6",
                  lineHeight: "1.7",
                }}
              >
                {isExpanded
                  ? item.answer
                  : shortAnswer}
              </p>

              <small
                style={{
                  color: "#aaa",
                }}
              >
                {new Date(
                  item.createdAt
                ).toLocaleString()}
              </small>

              <div
                style={{
                  marginTop: "10px",
                  color: "#7cf29a",
                  fontSize: "14px",
                }}
              >
                {isExpanded
                  ? "▲ Click to collapse"
                  : "▼ Click to expand"}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default History;
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

      if (!user?.email) return;

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
              fontSize: "15px",
              fontWeight: "600",
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
            item.answer?.split(" ").length > 8
              ? item.answer
                  .split(" ")
                  .slice(0, 8)
                  .join(" ") + "..."
              : item.answer;

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
                border: isExpanded
                  ? "1px solid #a855f7"
                  : "1px solid transparent",
                transition: "0.3s",
              }}
            >
              <h2
                style={{
                  marginBottom: "12px",
                  fontSize: "28px",
                }}
              >
                {item.question}
              </h2>

              <p
                style={{
                  color: "#d6d6d6",
                  lineHeight: "1.8",
                  fontSize: "17px",
                }}
              >
                {isExpanded
                  ? item.answer
                  : shortAnswer}
              </p>

              <div
                style={{
                  marginTop: "15px",
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                }}
              >
                <small
                  style={{
                    color: "#9ca3af",
                  }}
                >
                  {new Date(
                    item.createdAt
                  ).toLocaleString()}
                </small>

                <span
                  style={{
                    color: "#a855f7",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {isExpanded
                    ? "▲ Collapse"
                    : "▼ Expand"}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default History;
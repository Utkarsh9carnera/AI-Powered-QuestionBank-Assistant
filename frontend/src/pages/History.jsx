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

      const confirmDelete = window.confirm(
        "Are you sure you want to clear your history?"
      );

      if (!confirmDelete) return;

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
        maxWidth: "1000px",
        margin: "35px auto",
        padding: "0 20px",
        color: "white",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h1
          style={{
            fontSize: "2.3rem",
            fontWeight: "700",
            margin: 0,
          }}
        >
          Search History
        </h1>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            style={{
              background: "#ff5c7a",
              border: "none",
              color: "white",
              padding: "10px 18px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Clear History
          </button>
        )}
      </div>

      {/* Empty State */}
      {history.length === 0 ? (
        <div
          style={{
            background: "#202a66",
            padding: "25px",
            borderRadius: "14px",
            textAlign: "center",
          }}
        >
          <h3>No searches found</h3>

          <p
            style={{
              color: "#cbd5e1",
            }}
          >
            Your search history will appear here.
          </p>
        </div>
      ) : (
        history.map((item) => {
          const isExpanded =
            expandedId === item.id;

          const shortAnswer =
            item.answer?.split(" ").length > 10
              ? item.answer
                  .split(" ")
                  .slice(0, 10)
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
                background: "#202a66",
                padding: "18px",
                borderRadius: "14px",
                marginBottom: "14px",
                cursor: "pointer",
                border: isExpanded
                  ? "1px solid #a855f7"
                  : "1px solid rgba(255,255,255,0.05)",
                transition: "all 0.25s ease",
              }}
            >
              {/* Question */}
              <h2
                style={{
                  marginBottom: "10px",
                  fontSize: "22px",
                  fontWeight: "600",
                  color: "#fff",
                }}
              >
                {item.question}
              </h2>

              {/* Answer */}
              <p
                style={{
                  color: "#d6d6d6",
                  lineHeight: "1.7",
                  fontSize: "15px",
                  marginBottom: "12px",
                }}
              >
                {(isExpanded
  ? item.answer
  : shortAnswer)
  .replace(/\*\*/g, "")
}
              </p>

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  borderTop:
                    "1px solid rgba(255,255,255,0.06)",
                  paddingTop: "10px",
                }}
              >
                <span
                  style={{
                    color: "#a855f7",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {isExpanded
                    ? "Hide Details ▲"
                    : "View Details ▼"}
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
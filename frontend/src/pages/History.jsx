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
        "Are you sure you want to clear your entire history?"
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
        maxWidth: "1300px",
        margin: "50px auto",
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
          marginBottom: "35px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <h1
          style={{
            fontSize: "3.2rem",
            fontWeight: "800",
            margin: 0,
          }}
        >
          📜 Search History
        </h1>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            style={{
              background:
                "linear-gradient(135deg,#ff4d6d,#ff758f)",
              border: "none",
              color: "white",
              padding: "12px 22px",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
              boxShadow:
                "0 8px 20px rgba(255,77,109,0.3)",
            }}
          >
            🗑 Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div
          style={{
            background:
              "linear-gradient(145deg,#1f275f,#252f73)",
            padding: "40px",
            borderRadius: "20px",
            textAlign: "center",
            border:
              "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h2>No searches found</h2>

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
                background:
                  "linear-gradient(145deg,#1f275f,#252f73)",
                padding: "28px",
                borderRadius: "20px",
                marginBottom: "22px",
                cursor: "pointer",
                border: isExpanded
                  ? "1px solid #c084fc"
                  : "1px solid rgba(255,255,255,0.08)",
                boxShadow:
                  "0 8px 30px rgba(0,0,0,0.25)",
                transition: "all 0.3s ease",
              }}
            >
              {/* Question */}
              <h2
                style={{
                  marginBottom: "16px",
                  fontSize: "30px",
                  fontWeight: "700",
                  color: "#fff",
                }}
              >
                {item.question}
              </h2>

              {/* Answer */}
              <p
                style={{
                  color: "#d4d8ff",
                  lineHeight: "1.9",
                  fontSize: "18px",
                  marginBottom: "20px",
                }}
              >
                {isExpanded
                  ? item.answer
                  : shortAnswer}
              </p>

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  borderTop:
                    "1px solid rgba(255,255,255,0.08)",
                  paddingTop: "15px",
                }}
              >
                <span
                  style={{
                    color: "#c084fc",
                    fontWeight: "600",
                    fontSize: "15px",
                  }}
                >
                  {isExpanded
                    ? "▲ Show Less"
                    : "▼ Read More"}
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
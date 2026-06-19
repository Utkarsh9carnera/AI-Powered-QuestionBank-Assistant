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

```
  if (!user?.email) return;

  const response = await axios.get(
    `https://ai-powered-questionbank-assistant.onrender.com/api/AIApi/history?userEmail=${user.email}`
  );

  setHistory(response.data);
} catch (error) {
  console.error(error);
}
```

};

const clearHistory = async () => {
try {
const user = JSON.parse(
localStorage.getItem("user")
);

```
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
```

};

return (
<div
style={{
maxWidth: "1100px",
margin: "40px auto",
padding: "0 20px",
color: "white",
}}
>
<div
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: "30px",
flexWrap: "wrap",
gap: "12px",
}}
>
<h1
style={{
fontSize: "2.4rem",
fontWeight: "700",
margin: 0,
}}
>
Search History </h1>

```
    {history.length > 0 && (
      <button
        onClick={clearHistory}
        style={{
          background: "#ff5c7a",
          border: "none",
          color: "white",
          padding: "10px 16px",
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

  {history.length === 0 ? (
    <div
      style={{
        background: "#202a66",
        padding: "30px",
        borderRadius: "14px",
        textAlign: "center",
      }}
    >
      <h3>No searches found</h3>
      <p style={{ color: "#cbd5e1" }}>
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
            background: "#202a66",
            padding: "20px",
            borderRadius: "14px",
            marginBottom: "16px",
            cursor: "pointer",
            border: isExpanded
              ? "1px solid #a855f7"
              : "1px solid rgba(255,255,255,0.05)",
            transition: "all 0.25s ease",
          }}
        >
          <h2
            style={{
              marginBottom: "12px",
              fontSize: "22px",
              fontWeight: "600",
              color: "#fff",
            }}
          >
            {item.question}
          </h2>

          <p
            style={{
              color: "#d6d6d6",
              lineHeight: "1.8",
              fontSize: "16px",
              marginBottom: "15px",
            }}
          >
            {isExpanded
              ? item.answer
              : shortAnswer}
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              borderTop:
                "1px solid rgba(255,255,255,0.06)",
              paddingTop: "12px",
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
                ? "Hide Details"
                : "View Details →"}
            </span>
          </div>
        </div>
      );
    })
  )}
</div>
```

);
}

export default History;

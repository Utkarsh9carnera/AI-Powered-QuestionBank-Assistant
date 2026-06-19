import { useEffect, useState } from "react";
import axios from "axios";

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const email =
      user?.email || "test@gmail.com";

    const response = await axios.get(
      `http://localhost:5199/api/AIApi/history?userEmail=${email}`
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

    fetchHistory();
  } catch (error) {
    console.error(error);
  }
};
  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        color: "white",
      }}
    >
      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  }}
>
  <h1>Search History</h1>

  <button
    onClick={clearHistory}
    style={{
      background: "#ff4d6d",
      color: "white",
      border: "none",
      padding: "10px 16px",
      borderRadius: "10px",
      cursor: "pointer",
    }}
  >
    🗑 Clear History
  </button>
</div>

      {history.length === 0 ? (
        <p>No searches found.</p>
      ) : (
        history.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#1f275f",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "15px",
            }}
          >
            <h3>{item.question}</h3>
            <p>{item.answer}</p>

            <small>
              {new Date(item.createdAt).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

export default History;
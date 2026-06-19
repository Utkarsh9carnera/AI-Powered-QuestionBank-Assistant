import { useEffect, useState } from "react";
import axios from "axios";

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) return;

    axios
      .get(
        `https://your-render-url/api/AIApi/history?userEmail=${user.email}`
      )
      .then((res) => {
        setHistory(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="container">
      <h1>Search History</h1>

      {history.length === 0 ? (
        <p>No searches yet.</p>
      ) : (
        history.map((item) => (
          <div
            key={item.id}
            className="history-card"
          >
            <h3>{item.question}</h3>

            <p>{item.answer}</p>

            <small>
              {item.createdAt}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

export default History;
import { useState } from "react";
import axios from "axios";

function Dashboard() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);

      const response = await axios.get(
        `https://ai-powered-questionbank-assistant.onrender.com/api/questions/search?query=${query}`
      );

      setAnswer(response.data.answer);
    } catch (error) {
      console.error(error);
      setAnswer("Error fetching answer.");
    } finally {
      setLoading(false);
    }
  };

  
}

export default Dashboard;
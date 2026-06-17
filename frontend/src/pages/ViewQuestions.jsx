import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ViewQuestions() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  const loadQuestions = async () => {
    try {
      const res = await axios.get(
        "https://ai-powered-questionbank-assistant.onrender.com/api/questions"
      );

      setQuestions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteQuestion = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this question?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `https://ai-powered-questionbank-assistant.onrender.com/api/questions/${id}`
      );

      console.log(response.data);

      alert("Question deleted successfully");

      loadQuestions();
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Delete failed"
      );
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  return (
    <div className="questions-container">
      <h2>All Questions</h2>

      <table className="questions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Question</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {questions.map((q) => (
            <tr key={q.questionId}>
              <td>{q.questionId}</td>

              <td>{q.questionText}</td>

              <td>{q.category}</td>

              <td>
                <button
                  className="edit-btn"
                  onClick={() =>
                    navigate(`/edit/${q.questionId}`)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteQuestion(q.questionId)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewQuestions;
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ViewQuestions() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const response = await axios.get(
        "https://ai-powered-questionbank-assistant.onrender.com/api/questions"
      );

      console.log(response.data);
      setQuestions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Delete this question?")) return;

    try {
      await axios.delete(
        `https://ai-powered-questionbank-assistant.onrender.com/api/questions/${id}`
      );

      alert("Question deleted successfully");
      loadQuestions();
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  return (
    <div className="questions-container">
      <h2 className="questions-title">
        All Questions ({questions.length})
      </h2>

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
          {questions.length > 0 ? (
            questions.map((q) => (
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
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "white"
                }}
              >
                No Questions Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ViewQuestions;
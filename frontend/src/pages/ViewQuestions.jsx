import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ViewQuestions() {
  const [questions, setQuestions] =
    useState([]);

  const navigate = useNavigate();

  const loadQuestions = async () => {
    const res = await axios.get(
      "http://localhost:5199/api/questions"
    );

    setQuestions(res.data);
  };

  const deleteQuestion = async (id) => {
    if (
      !window.confirm(
        "Delete this question?"
      )
    )
      return;

    await axios.delete(
      `http://localhost:5199/api/questions/${id}`
    );

    loadQuestions();
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

              <td>
                {q.questionText}
              </td>

              <td>{q.category}</td>

              <td>
                <button
                  className="edit-btn"
                  onClick={() =>
                    navigate(
                      `/edit/${q.questionId}`
                    )
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteQuestion(
                      q.questionId
                    )
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
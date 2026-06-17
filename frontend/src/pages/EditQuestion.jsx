import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    loadQuestion();
  }, []);

  const loadQuestion = async () => {
    try {
      const response = await axios.get(
        `https://ai-powered-questionbank-assistant.onrender.com/api/questions/${id}`
      );

      setQuestionText(response.data.questionText);
      setAnswerText(response.data.answerText);
      setCategory(response.data.category);
    } catch (error) {
      console.error(error);
    }
  };

  const updateQuestion = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `https://ai-powered-questionbank-assistant.onrender.com/api/questions/${id}`,
        {
          questionText,
          answerText,
          category
        }
      );

      alert("Question Updated");
      navigate("/view");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="edit-page">
      <div className="edit-card">

        <h1 className="edit-title">
          Edit Question
        </h1>

        <form
          className="edit-form"
          onSubmit={updateQuestion}
        >

          <input
            type="text"
            placeholder="Question"
            value={questionText}
            onChange={(e) =>
              setQuestionText(e.target.value)
            }
          />

          <textarea
            placeholder="Answer"
            value={answerText}
            onChange={(e) =>
              setAnswerText(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          />

          <button
            type="submit"
            className="update-btn"
          >
            Update Question
          </button>

        </form>

      </div>
    </div>
  );
}

export default EditQuestion;
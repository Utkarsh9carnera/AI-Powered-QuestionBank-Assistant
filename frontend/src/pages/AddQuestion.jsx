import { useState } from "react";
import axios from "axios";

function AddQuestion() {
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [category, setCategory] = useState("");

  const saveQuestion = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://ai-powered-questionbank-assistant.onrender.com/api/questions",
        {
          questionText,
          answerText,
          category
        }
      );

      alert("Question Added Successfully");

      setQuestionText("");
      setAnswerText("");
      setCategory("");
    } catch (error) {
      console.error(error);
      alert("Failed to add question");
    }
  };

  return (
    <div className="add-container">
      <div className="add-card">

        <h1>Add Question</h1>

        <form
          className="add-form"
          onSubmit={saveQuestion}
        >

          <input
            type="text"
            placeholder="Enter Question"
            value={questionText}
            onChange={(e) =>
              setQuestionText(e.target.value)
            }
            required
          />

          <textarea
            placeholder="Enter Answer"
            value={answerText}
            onChange={(e) =>
              setAnswerText(e.target.value)
            }
            required
          />

          <input
            type="text"
            placeholder="Enter Category"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="add-btn"
          >
            Save Question
          </button>

        </form>

      </div>
    </div>
  );
}

export default AddQuestion;
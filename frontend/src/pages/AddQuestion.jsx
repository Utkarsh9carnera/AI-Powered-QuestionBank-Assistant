import { useState } from "react";
import axios from "axios";

function AddQuestion() {
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://ai-powered-questionbank-assistant.onrender.com/api/questions",
        {
          questionText,
          answerText,
          category,
        }
      );

      alert("Question Added Successfully");

      setQuestionText("");
      setAnswerText("");
      setCategory("");
    } catch (error) {
      console.error(error);
      alert("Error adding question");
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h1>Add Question</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Question"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
          />

          <textarea
            placeholder="Enter Answer"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Enter Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <button type="submit">
            Save Question
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddQuestion;
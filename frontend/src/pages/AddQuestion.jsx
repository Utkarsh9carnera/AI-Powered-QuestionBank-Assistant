import { useState } from "react";
import axios from "axios";

function AddQuestion() {
  const [questionText, setQuestionText] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");

  const saveQuestion = async () => {
    try {
      await axios.post(
  "https://ai-powered-questionbank-assistant.onrender.com/api/questions",
  {
    questionText: questionText,
    answerText: answer,
    category: category
  }
);

      alert("Question Saved");

      setQuestionText("");
      setAnswer("");
      setCategory("");
    } catch {
      alert("Failed to save question");
    }
  };

  return (
    <div className="form-container">
      <h2>Add Question</h2>

      <input
        type="text"
        placeholder="Enter Question"
        value={questionText}
        onChange={(e) =>
          setQuestionText(e.target.value)
        }
      />

      <textarea
        placeholder="Enter Answer"
        value={answer}
        onChange={(e) =>
          setAnswer(e.target.value)
        }
      />

      <input
        type="text"
        placeholder="Enter Category"
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
      />

      <button onClick={saveQuestion}>
        Save Question
      </button>
    </div>
  );
}

export default AddQuestion;
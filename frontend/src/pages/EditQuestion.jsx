import { useEffect, useState } from "react";
import axios from "axios";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

function EditQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questionText, setQuestionText] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [category, setCategory] =
    useState("");

  useEffect(() => {
    loadQuestion();
  }, []);

  const loadQuestion = async () => {
    const res = await axios.get(
      "https://ai-powered-questionbank-assistant.onrender.com/api/questions"
    );

    const q = res.data.find(
      (x) => x.questionId === parseInt(id)
    );

    if (q) {
      setQuestionText(q.questionText);
      setAnswer(q.answer);
      setCategory(q.category);
    }
  };

  const updateQuestion = async () => {
    try {
      await axios.put(
        `http://localhost:5199/api/questions/${id}`,
        {
          questionText,
          answer,
          category,
        }
      );

      alert("Question Updated");

      navigate("/view");
    } catch {
      alert("Update Failed");
    }
  };

  return (
    <div className="form-container">
      <h2>Edit Question</h2>

      <input
        value={questionText}
        onChange={(e) =>
          setQuestionText(e.target.value)
        }
      />

      <textarea
        value={answer}
        onChange={(e) =>
          setAnswer(e.target.value)
        }
      />

      <input
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
      />

      <button onClick={updateQuestion}>
        Update Question
      </button>
    </div>
  );
}

export default EditQuestion;
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AddQuestion from "./pages/AddQuestion";
import ViewQuestions from "./pages/ViewQuestions";
import EditQuestion from "./pages/EditQuestion";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">

        <nav className="navbar">
          <Link to="/">Home</Link>
          <Link to="/add">Add Question</Link>
          <Link to="/view">View Questions</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddQuestion />} />
          <Route path="/view" element={<ViewQuestions />} />
          <Route path="/edit/:id" element={<EditQuestion />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AddQuestion from "./pages/AddQuestion";
import ViewQuestions from "./pages/ViewQuestions";
import EditQuestion from "./pages/EditQuestion";
import History from "./pages/History";
import Login from "./pages/Login";

import "./App.css";

function App() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <BrowserRouter>
      <div className="app-container">

        <nav className="navbar">

          <Link to="/">Home</Link>

          <Link to="/add">
            Add Question
          </Link>

          <Link to="/view">
            View Questions
          </Link>
          {user && (
  <Link to="/history">
    History
  </Link>
)}

          {user ? (
  <>
    <div className="user-info">
      <img
        src={user.picture}
        alt="Profile"
        className="profile-pic"
      />

      <span>
        {user.given_name}
      </span>
    </div>

    <button
      onClick={logout}
      className="logout-btn"
    >
      Logout
    </button>
  </>
) : (
  <Link to="/login">
    Login
  </Link>
)}

        </nav>

        <Routes>
          <Route
  path="/history"
  element={<History />}
/>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/add"
            element={<AddQuestion />}
          />

          <Route
            path="/view"
            element={<ViewQuestions />}
          />

          <Route
            path="/edit/:id"
            element={<EditQuestion />}
          />

        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
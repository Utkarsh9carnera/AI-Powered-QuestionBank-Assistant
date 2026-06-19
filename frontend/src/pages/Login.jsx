import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleSuccess = (response) => {
    const user = jwtDecode(response.credential);

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    window.location.href = "/";
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-icon">🤖</div>

        <h1>Welcome Back</h1>

        <p>
          Sign in to access your AI Question Bank
        </p>

        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log("Login Failed")}
        />

        <div className="login-features">

          <div>✅ AI Powered Search</div>

          <div>📚 Question Management</div>

          <div>🔐 Secure Google Login</div>

        </div>

      </div>

    </div>
  );
}

export default Login;
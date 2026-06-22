import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const handleSuccess = async (response) => {
  try {
    const result = await axios.post(
  "https://questionbank-backend-cve3.onrender.com/api/auth/google-login",
  {
    idToken: response.credential,
  }
);

    localStorage.setItem(
      "user",
      JSON.stringify(result.data)
    );

    window.location.href = "/";
  } catch (error) {
    console.error("Login failed:", error);

    alert(
      error?.response?.data ||
      "Google authentication failed"
    );
  }
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
          onError={() =>
            console.log("Login Failed")
          }
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
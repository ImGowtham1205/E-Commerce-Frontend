import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaAmazon } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from "../api/axiosConfig";
import "../styles/Login.css";
import logo from "../assets/azcart-logo.jpeg";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto clear error message
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/authservice/auth/login", {
        email: email.trim(),
        password: password.trim()
      });

      if (response.status === 200) {
        const { token, role } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        if (role === "ROLE_ADMIN") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/welcome", { replace: true });
        }
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          const serverMsg =
            typeof err.response.data === "string"
              ? err.response.data
              : err.response.data?.message;

          setError(serverMsg || "Invalid email or password");
        } else {
          setError("Login failed. Try again.");
        }
      } else {
        setError("Server not reachable");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit} noValidate>

        <img src={logo} alt="AZCART Logo" className="login-logo" />
        <h2>AZCART LOGIN</h2>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-eye-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <div className="forgot-password">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="login-message error">{error}</p>}

        <div className="signup-text">
          Don’t have an account? <Link to="/register">Sign up</Link>
        </div>

        {/* OAuth Divider */}
        <div className="oauth-buttons">

  <button
    type="button"
    className="oauth-btn google-btn"
    onClick={() => {
      window.location.href = "http://localhost:8765/authservice/oauth2/authorization/google";
    }}
  >
    <FcGoogle className="oauth-icon" />
    Continue with Google
  </button>

  <button
    type="button"
    className="oauth-btn amazon-btn"
    onClick={() => {
      window.location.href = "http://localhost:8765/authservice/oauth2/authorization/amazon";
    }}
  >
    <FaAmazon className="oauth-icon" />
    Continue with Amazon
  </button>

</div>

      </form>
    </div>
  );
}

export default Login;
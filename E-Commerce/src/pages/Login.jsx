import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/Login.css";
import logo from "../assets/azcart-logo.jpeg";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ⏱ Auto-clear error message
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
      const response = await api.post(
        "/login",
        {
          email: email.trim(),
          password: password.trim()
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      // ✅ Spring returns JWT token as String
      if (response.status === 200 && response.data) {
        localStorage.setItem("token", response.data);
        navigate("/welcome", { replace: true });
      }
    } catch (err) {
      if (err.response) {
        // 🔴 Server responded
        if (err.response.status === 401) {
          setError("Invalid email or password");
        } else {
          setError("Login failed. Try again.");
        }
      } else {
        // 🔴 Server not reachable
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
          <input
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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
      </form>
    </div>
  );
}

export default Login;

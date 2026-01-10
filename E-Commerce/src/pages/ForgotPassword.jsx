import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/ForgotPassword.css";
import logo from "../assets/azcart-logo.jpeg";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto clear messages
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/forgot-password",
        { email },
        { validateStatus: () => true }
      );

      if (response.status === 200) {
        setMessage(response.data);
      } else {
        setError(response.data || "Email not registered");
      }
    } catch {
      setError("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <form className="forgot-card" onSubmit={handleSubmit} noValidate>
        <img src={logo} alt="AZCART Logo" className="forgot-logo" />

        <h2>Forgot Password</h2>
        <p className="forgot-text">
          Enter your registered email to receive a password reset link
        </p>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="forgot-btn" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {message && <p className="forgot-message success">{message}</p>}
        {error && <p className="forgot-message error">{error}</p>}

        <div className="back-login">
          <Link to="/login">Back to Login</Link>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;

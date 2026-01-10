import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import "../styles/ResetPassword.css";
import logo from "../assets/azcart-logo.jpeg";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // 🔒 token from URL

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password pattern
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  // Live password validation
  useEffect(() => {
    setPasswordValid(passwordRegex.test(password));
  }, [password]);

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

    if (!password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (!passwordValid) {
      setError("Password does not meet security requirements");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid or expired reset link");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/reset-password",
        {
          token: token,
          password: password
        },
        {
          headers: {
            "Content-Type": "application/json"
          },
          validateStatus: () => true
        }
      );

      if (response.status === 200) {
        setMessage(response.data);
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(response.data || "Reset failed");
      }
    } catch (err) {
      setError("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <form className="reset-card" onSubmit={handleSubmit} noValidate>
        <img src={logo} alt="AZCART Logo" className="reset-logo" />

        <h2>Reset Password</h2>

        {/* Password Rules */}
        <div className="password-rules">
          <p>Password must contain:</p>
          <ul>
            <li>Minimum 8 characters</li>
            <li>1 uppercase letter (A–Z)</li>
            <li>1 lowercase letter (a–z)</li>
            <li>1 number (0–9)</li>
            <li>1 special character (@#$%!)</li>
          </ul>
        </div>

        {/* Hidden Token */}
        <input type="hidden" value={token || ""} />

        <div className="input-group">
          <label>New Password</label>
          <input
            type="password"
            value={password}
            placeholder="Enter new password"
            onChange={(e) => setPassword(e.target.value)}
            className={
              password
                ? passwordValid
                  ? "valid-input"
                  : "invalid-input"
                : ""
            }
          />
        </div>

        <div className="input-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            placeholder="Re-enter new password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={
              confirmPassword
                ? password === confirmPassword
                  ? "valid-input"
                  : "invalid-input"
                : ""
            }
          />
        </div>

        <button
          type="submit"
          className="reset-btn"
          disabled={loading || !passwordValid}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {message && <p className="reset-message success">{message}</p>}
        {error && <p className="reset-message error">{error}</p>}

        <div className="back-login">
          <Link to="/login">Back to Login</Link>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;

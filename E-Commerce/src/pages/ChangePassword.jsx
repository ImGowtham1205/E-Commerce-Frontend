import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from "../api/axiosConfig";
import "../styles/Welcome.css";

function ChangePassword() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [welcomeText, setWelcomeText] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // Password pattern:
  // min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  /* 🔹 Logout */
  const handleLogout = async () => {
  try {
    await api.post("/authservice/auth/api/user/logout");
  } catch (err) {
    console.error("Logout API failed", err);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  }
};

  /* 🔹 Fetch welcome text */
  useEffect(() => {
    const fetchWelcome = async () => {
      try {
        const response = await api.get("/authservice/auth/api/user/home");
        setWelcomeText(response.data);
      } catch (error) {
        console.error("Failed to load welcome message", error);
      }
    };
    fetchWelcome();
  }, []);

  /* 🔹 Auto-hide messages after 3 seconds */
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  /* 🔹 Form Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Required field validation
    if (!currentPassword.trim()) {
      setError("Current password is required.");
      return;
    }

    if (!newPassword.trim()) {
      setError("New password is required.");
      return;
    }

    if (!confirmPassword.trim()) {
      setError("Confirm password is required.");
      return;
    }

    // Pattern validation
    if (!passwordPattern.test(newPassword)) {
      setError("New password does not match the required pattern.");
      return;
    }

    // Match validation
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await api.put("/authservice/auth/api/user/changepassword", {
        currentpassword: currentPassword,
        newpassword: newPassword,
      });

      setSuccess(response.data);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data || "Failed to update password.");
    }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <header className="navbar">
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <h1 className="logo">{welcomeText}</h1>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => navigate("/welcome")}>🏠 Home</li>
          <li onClick={() => navigate("/userinfo")}>👤 Personal Info</li>
          <li onClick={() => navigate("/cart")}>🛒 Cart</li>
          <li onClick={() => navigate("/orders")}>📦 Orders</li>       
          <li className="danger" onClick={() => navigate("/delete-account")}>🗑 Delete Account</li>
          <li className="logout" onClick={handleLogout}>🚪Logout</li>
        </ul>
      </aside>

      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* Main Content */}
      <main className="content">
        <div className="password-card modern-card">
          <h2>Change Password</h2>

          <div className="password-rules modern-rules">
            <strong>Password must contain:</strong>
            <ul>
              <li>Minimum 8 characters</li>
              <li>1 uppercase letter</li>
              <li>1 lowercase letter</li>
              <li>1 number</li>
              <li>1 special character</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="password-form modern-form">
            <div className="password-field">
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-eye-btn"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showCurrentPassword ? "Hide password" : "Show password"}
              >
                {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="password-field">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-eye-btn"
                onClick={() => setShowNewPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-eye-btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {error && <div className="alert error-alert">{error}</div>}
            {success && <div className="alert success-alert">{success}</div>}

            <button type="submit" className="password-btn modern-btn">
              Update Password
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ChangePassword;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/Welcome.css";

function ChangePassword() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [welcomeText, setWelcomeText] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
    await api.post("/api/user/logout");
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
        const response = await api.get("/api/user/home");
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
      const response = await api.put("/api/user/changepassword", {
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
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

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

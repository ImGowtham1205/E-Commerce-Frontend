import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/Adminwelcome.css";
import "../styles/AdminChangePassword.css";

function AdminChangePassword() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // 🔐 Password regex
  const passwordPattern =
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";

  // 🔍 Live password rule check
  const passwordRules = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[@$!%*?&]/.test(newPassword),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await api.put("/api/admin/changepassword", {
        currentpassword: currentPassword,
        newpassword: newPassword,
      });

      setSuccess(res.data);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError(err.response?.data || "Password update failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      {/* Navbar */}
      <header className="admin-navbar">
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <h1 className="logo">AzCart Admin</h1>
      </header>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${menuOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => navigate("/admin")}>🏠 Home</li>
          <li onClick={() => navigate("/admin/profile")}>👤 Personal Info</li>
          <li className="danger" onClick={() => navigate("/admin/delete-account")}>
            🗑 Delete Account
          </li>
          <li className="logout" onClick={handleLogout}>
            🚪 Logout
          </li>
        </ul>
      </aside>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}

      {/* Main Content */}
      <main className="admin-content">
        <h2>Change Password</h2>
        <p>Update your admin account password</p>

        <form className="password-card" onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              required
              pattern={passwordPattern}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <ul className="password-rules">
              <li className={passwordRules.length ? "valid" : ""}>
                Minimum 8 characters
              </li>
              <li className={passwordRules.upper ? "valid" : ""}>
                At least 1 uppercase letter
              </li>
              <li className={passwordRules.lower ? "valid" : ""}>
                At least 1 lowercase letter
              </li>
              <li className={passwordRules.number ? "valid" : ""}>
                At least 1 number
              </li>
              <li className={passwordRules.special ? "valid" : ""}>
                At least 1 special character (@ $ ! % * ? &)
              </li>
            </ul>
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default AdminChangePassword;

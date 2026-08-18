import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from "../api/axiosConfig";
import "../styles/AdminWelcome.css";
import "../styles/AdminChangePassword.css";

function AdminChangePassword() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ================= Logout ================= */
  const handleLogout = async () => {
  try {
    await api.post("/authservice/auth/api/admin/logout");
  } catch (err) {
    console.error("Logout API failed", err);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  }
};

  /* ================= Auto-hide server messages ================= */
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  /* ================= Password Regex ================= */
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  /* ================= Live Password Rules ================= */
  const passwordRules = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[@$!%*?&]/.test(newPassword),
  };

  /* ================= Submit ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {};

    if (!currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else if (!passwordRegex.test(newPassword)) {
      errors.newPassword = "Password does not meet required rules";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      const res = await api.put("/authservice/auth/api/admin/changepassword", {
        currentpassword: currentPassword,
        newpassword: newPassword,
      });

      setSuccess(res.data || "Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setFieldErrors({});
    } catch (err) {
      setError(err.response?.data || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      {/* ================= Top Navbar (SAME AS AdminWelcome) ================= */}
      <header className="admin-navbar">
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <h1 className="logo">AzCart Admin</h1>
      </header>

      {/* ================= Sidebar (SAME AS AdminWelcome) ================= */}
      <aside className={`admin-sidebar ${menuOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => navigate("/admin")}>🏠 Home</li>
          <li onClick={() => navigate("/admin/profile")}>👤 Personal Info</li>
          <li onClick={() => navigate("/admin/add-product")}>➕ Add Product</li>
          <li onClick={() => navigate("/admin/products")}>📦 Manage Products </li>
          <li onClick={() => navigate("/admin/orders")}>🧾 Manage Orders</li>
          <li className="danger" onClick={() => navigate("/admin/delete-account")}> 🗑 Delete Account</li>
          <li className="logout" onClick={handleLogout}>
            🚪 Logout
          </li>
        </ul>
      </aside>

      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* ================= Main Content ================= */}
      <main className="admin-content">
        <h2>Change Password</h2>
        <p>Update your admin account password</p>

        <form className="password-card" onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          {/* Current Password */}
          <div className="form-group">
            <label>Current Password</label>
            <div className="password-field">
              <input
                type={showCurrentPassword ? "text" : "password"}
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
            {fieldErrors.currentPassword && (
              <small className="field-error">
                {fieldErrors.currentPassword}
              </small>
            )}
          </div>

          {/* New Password */}
          <div className="form-group">
            <label>New Password</label>
            <div className="password-field">
              <input
                type={showNewPassword ? "text" : "password"}
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

            {fieldErrors.newPassword && (
              <small className="field-error">
                {fieldErrors.newPassword}
              </small>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm New Password</label>
            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
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
            {fieldErrors.confirmPassword && (
              <small className="field-error">
                {fieldErrors.confirmPassword}
              </small>
            )}
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
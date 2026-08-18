import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/AdminDeleteAccount.css";

function AdminDeleteAccount() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error

  const navigate = useNavigate();

  /* ===== LOGOUT ===== */
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

  /* ===== SHOW MESSAGE FOR FEW SECONDS ===== */
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");

      if (type === "success") {
        // Hard redirect after successful account deletion.
        window.location.href = "/login";
      }
    }, 3000);
  };

  /* ===== DELETE ACCOUNT ===== */
  const handleDelete = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      showMessage("Password is required", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await api.delete(
        "/authservice/auth/api/admin/accountdeletion",
        {
          data: { password },
        }
      );

      // Clear authentication immediately after successful deletion.
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      showMessage(
        res.data || "Account deleted successfully",
        "success"
      );
    } catch (err) {
      showMessage(
        err.response?.data || "Failed to delete account",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">

      {/* ===== NAVBAR ===== */}
      <header className="admin-navbar">
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <h1 className="logo">AzCart Admin</h1>
      </header>

      {/* ===== SIDEBAR ===== */}
      <aside className={`admin-sidebar ${menuOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => navigate("/admin")}>
            🏠 Home
          </li>

          <li onClick={() => navigate("/admin/profile")}>
            👤 Personal Info
          </li>

          <li onClick={() => navigate("/admin/add-product")}>
            ➕ Add Product
          </li>

          <li onClick={() => navigate("/admin/products")}>
            📦 Manage Products
          </li>

          <li onClick={() => navigate("/admin/orders")}>
            🧾 Manage Orders
          </li>

          <li onClick={() => navigate("/admin/change-password")}>
            🔑 Change Password
          </li>

          <li className="danger">
            🗑 Delete Account
          </li>

          <li className="logout" onClick={handleLogout}>
            🚪 Logout
          </li>
        </ul>
      </aside>

      {/* ===== OVERLAY ===== */}
      {menuOpen && (
        <div
          className="overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ===== MAIN CONTENT ===== */}
      <main className="admin-content">

        <h2>Delete Admin Account ⚠</h2>

        <p className="warning-text">
          This action is <strong>permanent</strong>. All admin data
          will be deleted.
        </p>

        {/* ===== SERVER MESSAGE ===== */}
        {message && (
          <div className={`server-message ${messageType}`}>
            {message}
          </div>
        )}

        {/* ===== DELETE FORM ===== */}
        <form
          className="delete-card"
          onSubmit={handleDelete}
        >
          <label htmlFor="admin-password">
            Confirm Password
          </label>

          {/* ===== PASSWORD INPUT ===== */}
          <div className="password-wrapper">

            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              title={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? "🙈" : "👁️"}
            </button>

          </div>

          {/* ===== DELETE BUTTON ===== */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Deleting..."
              : "Delete My Account"}
          </button>

        </form>

      </main>
    </div>
  );
}

export default AdminDeleteAccount;
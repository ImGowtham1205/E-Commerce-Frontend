import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/AdminDeleteAccount.css";

function AdminDeleteAccount() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error

  const navigate = useNavigate();

  /* ===== LOGOUT ===== */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  /* ===== SHOW MESSAGE FOR FEW SECONDS ===== */
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      if (type === "success") {
        handleLogout();
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

      const res = await api.delete("/api/admin/accountdeletion", {
        data: password, // ✅ raw string for @RequestBody String password
        headers: {
          "Content-Type": "text/plain",
        },
      });

      showMessage(res.data || "Account deleted successfully", "success");
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
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <h1 className="logo">AzCart Admin</h1>
      </header>

      {/* ===== SIDEBAR ===== */}
      <aside className={`admin-sidebar ${menuOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => navigate("/admin/profile")}>👤 Personal Info</li>
          <li onClick={() => navigate("/admin/add-product")}>➕ Add Product</li>
          <li onClick={() => navigate("/admin/products")}>
            📦 Manage Products
          </li>
          <li onClick={() => navigate("/admin/orders")}>🧾 Manage Orders</li>
          <li onClick={() => navigate("/admin/change-password")}>
            🔑 Change Password
          </li>
          <li className="danger">🗑 Delete Account</li>
          <li className="logout" onClick={handleLogout}>
            🚪 Logout
          </li>
        </ul>
      </aside>

      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* ===== MAIN CONTENT ===== */}
      <main className="admin-content">
        <h2>Delete Admin Account ⚠</h2>
        <p className="warning-text">
          This action is <strong>permanent</strong>. All admin data will be
          deleted.
        </p>

        {/* ===== SERVER MESSAGE ===== */}
        {message && (
          <div className={`server-message ${messageType}`}>
            {message}
          </div>
        )}

        {/* ===== DELETE FORM ===== */}
        <form className="delete-card" onSubmit={handleDelete}>
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Deleting..." : "Delete My Account"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default AdminDeleteAccount;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/Welcome.css";

function DeleteAccount() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [welcomeText, setWelcomeText] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Fetch welcome text
  useEffect(() => {
    const fetchWelcome = async () => {
      try {
        const res = await api.get("/api/user/home");
        setWelcomeText(res.data);
      } catch (err) {
        console.error("Failed to load welcome message", err);
      }
    };

    fetchWelcome();
  }, []);

  // Delete account handler
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.delete("/api/user/accountdeletion", {
        data: password,
        headers: {
          "Content-Type": "text/plain"
        }
      });

      setSuccess(res.data || "Account deleted successfully");

      setTimeout(() => {
        handleLogout();
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data || "Account deletion failed. Please check your password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <header className="navbar">
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
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
          <li onClick={() => navigate("/changepassword")}>
            🔑 Change Password
          </li>
          <li className="logout" onClick={handleLogout}>
            🚪 Logout
          </li>
        </ul>
      </aside>

      {menuOpen && (
        <div
          className="overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="content">
        <div className="modern-card">
          <h2 style={{ textAlign: "center", color: "#dc2626" }}>
            Confirm Account Deletion
          </h2>

          <p style={{ margin: "14px 0", color: "#475569", fontSize: "14px" }}>
            This action is <strong>permanent</strong>.  
            Please enter your password to confirm deletion.
          </p>

          {error && <div className="alert error-alert">{error}</div>}
          {success && <div className="alert success-alert">{success}</div>}

          <form onSubmit={handleDeleteAccount} className="modern-form">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="password-btn"
              style={{ background: "#dc2626" }}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete My Account"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default DeleteAccount;

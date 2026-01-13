import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/Welcome.css";

function UserInfo() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [welcomeText, setWelcomeText] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔹 Fetch welcome text
        const welcomeRes = await api.get("/api/user/home");
        setWelcomeText(welcomeRes.data);

        // 🔹 Fetch user info
        const userRes = await api.get("/api/user/userinfo");
        setUser(userRes.data);
      } catch (err) {
        setError("Failed to load user information");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app-container">
      {/* Navbar */}
      <header className="navbar">
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        {/* ✅ Dynamic Welcome Text */}
        <h1 className="logo">{welcomeText}</h1>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => navigate("/welcome")}>🏠 Home</li>
          <li onClick={() => navigate("/userinfo")}>👤 Personal Info</li>
          <li>🛒 Cart</li>
          <li>📦 Orders</li>
          <li onClick={() => navigate("/changepassword")}>🔑 Change Password</li>
          <li className="danger">🗑 Delete Account</li>
          <li className="logout" onClick={handleLogout}>🚪 Logout</li>
        </ul>
      </aside>

      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* Main Content */}
      <main className="content">
        <div className="modern-card">
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Personal Information
          </h2>

          {error && <div className="alert error-alert">{error}</div>}

          {user ? (
            <div className="user-info-grid">
              <div className="info-row">
                <span>Name</span>
                <p>{user.name}</p>
              </div>

              <div className="info-row">
                <span>Email</span>
                <p>{user.email}</p>
              </div>

              <div className="info-row">
                <span>Phone Number</span>
                <p>{user.phoneno}</p>
              </div>

              <div className="info-row">
                <span>Role</span>
                <p>{user.role}</p>
              </div>
            </div>
          ) : (
            <p style={{ textAlign: "center" }}>Loading...</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserInfo;

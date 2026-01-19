import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/Welcome.css";

function Welcome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [welcomeText, setWelcomeText] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

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
          <li onClick={() => navigate("/userinfo")}>👤 Personal Info</li>
          <li onClick={() => navigate("/cart")}>🛒 Cart</li>
          <li>📦 Orders</li>
          <li onClick={() => navigate("/changepassword")}>
            🔑 Change Password
          </li>
          <li className="danger">🗑 Delete Account</li>
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
        <div className="category-header">
          <h2>Choose Your Category</h2>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="category-grid">
          {/* Electronics */}
          <div
            className="category-card"
            onClick={() => navigate("/category/Electronics")}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3659/3659899.png"
              alt="Electronics"
            />
            <h3>Electronics</h3>
            <p>Mobiles, Laptops, Accessories</p>
          </div>

          {/* Books */}
          <div
            className="category-card"
            onClick={() => navigate("/category/Books")}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
              alt="Books"
            />
            <h3>Books</h3>
            <p>Novels, Academics, Comics</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Welcome;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:8080/api/user/home", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setWelcomeText(response.data);
      } catch (error) {
        console.error("Failed to load welcome message", error);
      }
    };

    fetchWelcome();
  }, []);

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
          <li>🛒 Cart</li>
          <li>📦 Orders</li>
          <li onClick={() => navigate("/changepassword")}>🔑 Change Password</li>
          <li className="danger">🗑 Delete Account</li>
          <li className="logout" onClick={handleLogout}>🚪 Logout</li>
        </ul>
      </aside>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}

      {/* Main Content */}
      <main className="content">
        <div className="category-header">
          <h2>Choose Your Category</h2>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="category-grid">
          <div className="category-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3659/3659899.png"
              alt="Electronics"
            />
            <h3>Electronics</h3>
            <p>Mobiles, Laptops, Accessories</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Welcome;

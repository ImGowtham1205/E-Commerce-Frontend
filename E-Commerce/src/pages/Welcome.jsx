import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/Welcome.css";

function Welcome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [welcomeText, setWelcomeText] = useState("");

  const navigate = useNavigate();

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
          <li onClick={() => navigate("/orders")}>📦 Orders</li>
          <li onClick={() => navigate("/changepassword")}>
            🔑 Change Password
          </li>
          <li className="danger" onClick={() => navigate("/delete-account")}>🗑 Delete Account</li>
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

          {/* Sports */}
          <div
            className="category-card"
            onClick={() => navigate("/category/Sports")}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/857/857455.png"
              alt="Sports"
            />
            <h3>Sports</h3>
            <p>Fitness, Outdoor, Sports Gear</p>
          </div>

          {/* Furniture */}
          <div
            className="category-card"
            onClick={() => navigate("/category/Furniture")}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1946/1946488.png"
              alt="Furniture"
            />
            <h3>Furniture</h3>
            <p>Sofas, Beds, Tables</p>
          </div>

          {/* Appliances */}
          <div
            className="category-card"
            onClick={() => navigate("/category/Applicances")}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1046/1046857.png"
              alt="Appliances"
            />
            <h3>Appliances</h3>
            <p>Kitchen & Home Appliances</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Welcome;

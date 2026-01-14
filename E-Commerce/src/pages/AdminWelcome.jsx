import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/AdminWelcome.css";

function AdminWelcome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [welcomeText, setWelcomeText] = useState("Loading...");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // 🔹 Fetch admin name from backend
  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        const res = await api.get("/api/admin/home");
        setWelcomeText(res.data);   // e.g. "Welcome , John"
      } catch (err) {
        console.error("Admin fetch error", err);
        handleLogout(); // Token invalid → logout
      }
    };

    fetchAdminName();
  }, []);

  return (
    <div className="admin-container">
      {/* Top Navbar */}
      <header className="admin-navbar">
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <h1 className="logo">AzCart Admin</h1>
      </header>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${menuOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => navigate("/admin/profile")}>👤 Personal Info</li>
          <li onClick={() => navigate("/admin/add-product")}>➕ Add Product</li>
          <li onClick={() => navigate("/admin/change-password")}>🔑 Change Password</li>
          <li className="danger" onClick={() => navigate("/admin/delete-account")}>
            🗑 Delete Account</li>
          <li className="logout" onClick={handleLogout}> 🚪 Logout</li>
        </ul>
      </aside>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}

      {/* Main Content */}
      <main className="admin-content">
        <h2>{welcomeText} 👋</h2>
        <p>Manage your store, products, and users from here.</p>

        <div className="admin-cards">
          <div className="card">
            <h3>Add Products</h3>
            <p>Upload and manage product listings.</p>
          </div>
          <div className="card">
            <h3>View Orders</h3>
            <p>Track customer purchases and status.</p>
          </div>
          <div className="card">
            <h3>Manage Users</h3>
            <p>Control user access and accounts.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminWelcome;

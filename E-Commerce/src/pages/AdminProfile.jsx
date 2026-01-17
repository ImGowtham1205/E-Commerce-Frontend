import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/AdminProfile.css";
import "../styles/AdminWelcome.css";

function AdminProfile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // 🔹 Fetch admin personal info
  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const res = await api.get("/api/admin/admininfo");
        setAdmin(res.data);
      } catch (err) {
        console.error("Failed to fetch admin info", err);
        handleLogout();
      }
    };

    fetchAdminInfo();
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
          <li onClick={() => navigate("/admin")}>🏠 Home</li>
          <li onClick={() => navigate("/admin/add-product")}>➕ Add Product</li>
          <li onClick={() => navigate("/admin/change-password")}>
            🔑 Change Password
          </li>
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
        <h2>Personal Information</h2>
        <p>Your registered admin details</p>

        {!admin ? (
          <p>Loading...</p>
        ) : (
          <div className="profile-card">
            <div className="profile-row">
              <span>Name</span>
              <strong>{admin.adminName}</strong>
            </div>
            <div className="profile-row">
              <span>Email</span>
              <strong>{admin.email}</strong>
            </div>
            <div className="profile-row">
              <span>Phone</span>
              <strong>{admin.phoneno}</strong>
            </div>
            <div className="profile-row">
              <span>Role</span>
              <strong>{admin.role}</strong>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminProfile;

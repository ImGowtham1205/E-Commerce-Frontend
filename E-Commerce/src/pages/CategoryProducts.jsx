import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/Welcome.css";

function CategoryProducts() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [welcomeText, setWelcomeText] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch welcome text
        const welcomeRes = await api.get("/api/user/home");
        setWelcomeText(welcomeRes.data);

        // Fetch products by category
        const productRes = await api.get(`/api/products/${category}`);
        setProducts(productRes.data);
      } catch (err) {
        console.error("Category page error", err);
      }
    };

    fetchData();
  }, [category]);

  return (
    <div className="app-container">
      {/* ===== Navbar ===== */}
      <header className="navbar">
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <h1 className="logo">{welcomeText}</h1>
      </header>

      {/* ===== Sidebar ===== */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => navigate("/welcome")}>🏠 Home</li>
          <li onClick={() => navigate("/userinfo")}>👤 Personal Info</li>
          <li onClick={() => navigate("/cart")}>🛒 Cart</li>
          <li onClick={() => navigate("/orders")}>📦 Orders</li>
          <li onClick={() => navigate("/changepassword")}>🔑 Change Password</li>
          <li className="danger">🗑 Delete Account</li>
          <li className="logout" onClick={handleLogout}>
            🚪 Logout
          </li>
        </ul>
      </aside>

      {/* ===== Overlay ===== */}
      {menuOpen && (
        <div
          className="overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ===== Main Content ===== */}
      <main className="content">
        <h2 style={{ marginBottom: "20px" }}>
          Products in "{category}"
        </h2>

        <div className="category-grid">
          {products.length === 0 ? (
            <p>No products found</p>
          ) : (
            products.map((product) => (
              <div
                className="category-card"
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={`http://localhost:8080/api/products/image/${product.id}`}
                  alt={product.productname}
                />
                <h3>{product.productname}</h3>
                <p>₹ {product.price}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default CategoryProducts;

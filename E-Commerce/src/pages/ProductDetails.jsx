import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/Welcome.css";
import "../styles/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [welcomeText, setWelcomeText] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  /* ===== Fetch Product ===== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const welcomeRes = await api.get("/api/user/home");
        setWelcomeText(welcomeRes.data);

        const productRes = await api.get(`/api/products/details/${id}`);
        setProduct(productRes.data);
      } catch (err) {
        console.error("Product details error", err);
      }
    };

    fetchData();
  }, [id]);

  /* ===== Auto Hide Message with Fade ===== */
  useEffect(() => {
    if (message) {
      setShowMessage(true);

      const hideTimer = setTimeout(() => {
        setShowMessage(false);
      }, 2500); // start fade-out

      const clearTimer = setTimeout(() => {
        setMessage("");
      }, 3000); // remove completely

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [message]);

  /* ===== Add To Cart ===== */
  const handleAddToCart = async () => {
    if (product.stock === 0) return;

    try {
      const cartData = {
        productId: product.id,
        quantity: 1,
      };

      const res = await api.post("/api/user/addtocart", cartData);
      setMessage(res.data);
    } catch (err) {
      setMessage("Failed to add product to cart");
    }
  };

  if (!product) {
    return <p style={{ padding: "24px" }}>Loading...</p>;
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="app-container">
      {/* ===== Navbar ===== */}
      <header className="navbar">
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
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
          <li>📦 Orders</li>
          <li onClick={() => navigate("/changepassword")}>🔑 Change Password</li>
          <li className="danger">🗑 Delete Account</li>
          <li className="logout" onClick={handleLogout}>🚪 Logout</li>
        </ul>
      </aside>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}

      {/* ===== Main Content ===== */}
      <main className="content">
        <div className="product-details-card">
          <div className="product-image-section">
            <img
              src={`http://localhost:8080/api/products/image/${product.id}`}
              alt={product.productname}
            />
          </div>

          <div className="product-info-section">
            <h2>{product.productname}</h2>
            <p className="product-description">{product.description}</p>
            <p className="product-price">₹ {product.price}</p>

            {/* ===== Stock Messages ===== */}
            {isOutOfStock && (
              <p className="stock-error">
                Product not available, please check later
              </p>
            )}

            {isLowStock && (
              <p className="stock-warning">
                Hurry! Only {product.stock} left in stock
              </p>
            )}

            {/* ===== Server Message ===== */}
            {message && (
              <p className={`cart-message ${showMessage ? "fade-in" : "fade-out"}`}>
                {message}
              </p>
            )}

            {/* ===== Action Buttons ===== */}
            <div className="product-actions">
              <button className="buy-btn" disabled={isOutOfStock}>
                Buy Now
              </button>

              <button
                className="cart-btn"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetails;

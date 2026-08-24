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

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 12;

  const handleLogout = async () => {
    try {
      await api.post("/authservice/auth/api/user/logout");
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
    }
  };

  // Reset to page 0 whenever category changes
  useEffect(() => {
    setCurrentPage(0);
  }, [category]);

  // Fetch products when category or currentPage changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const welcomeRes = await api.get("/authservice/auth/api/user/home");
        setWelcomeText(welcomeRes.data);

        const productRes = await api.get(
          `/product-service/api/products/${category}?page=${currentPage}&size=${pageSize}`
        );

        setProducts(productRes.data.content);
        setTotalPages(productRes.data.page.totalPages);
        setTotalElements(productRes.data.page.totalElements);
      } catch (err) {
        console.error("Category page error", err);
      }
    };

    fetchData();
  }, [category, currentPage]);

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

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
          <li onClick={() => navigate("/orders")}>📦 Orders</li>
          <li onClick={() => navigate("/changepassword")}>🔑 Change Password</li>
          <li className="danger" onClick={() => navigate("/delete-account")}>
            🗑 Delete Account
          </li>
          <li className="logout" onClick={handleLogout}>
            🚪 Logout
          </li>
        </ul>
      </aside>

      {/* ===== Overlay ===== */}
      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* ===== Main Content ===== */}
      <main className="content">
        <h2 style={{ marginBottom: "10px" }}>Products in "{category}"</h2>

        {/* Results count */}
        {totalElements > 0 && (
          <p style={{ marginBottom: "20px", color: "#888" }}>
            Showing {currentPage * pageSize + 1}–
            {Math.min((currentPage + 1) * pageSize, totalElements)} of{" "}
            {totalElements} products
          </p>
        )}

        {/* ===== Product Grid ===== */}
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
                  src={`http://localhost:8765/product-service/api/products/image/${product.id}`}
                  alt={product.productname}
                />
                <h3>{product.productname}</h3>
                <p>₹ {product.price}</p>
              </div>
            ))
          )}
        </div>

        {/* ===== Pagination Controls ===== */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              marginTop: "30px",
            }}
          >
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              style={{
                padding: "8px 20px",
                cursor: currentPage === 0 ? "not-allowed" : "pointer",
                opacity: currentPage === 0 ? 0.5 : 1,
              }}
            >
              ← Prev
            </button>

            <span>
              Page {currentPage + 1} of {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              style={{
                padding: "8px 20px",
                cursor:
                  currentPage === totalPages - 1 ? "not-allowed" : "pointer",
                opacity: currentPage === totalPages - 1 ? 0.5 : 1,
              }}
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default CategoryProducts;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/AdminProducts.css";

function AdminProducts() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");

  const [deleteProduct, setDeleteProduct] = useState(null);
  const [serverMessage, setServerMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/authservice/auth/api/admin/logout");
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
    }
  };

  // ===== FETCH PRODUCTS =====
  const fetchProducts = async (selectedCategory = "all", page = 0) => {
    try {
      const res =
        selectedCategory === "all"
          ? await api.get(`/product-service/api/products?page=${page}&size=${pageSize}`)
          : await api.get(`/product-service/api/products/${selectedCategory}?page=${page}&size=${pageSize}`);

      setProducts(res.data.content);
      setTotalPages(res.data.page.totalPages);
      setTotalElements(res.data.page.totalElements);
    } catch (err) {
      console.error("Failed to fetch products", err);
      handleLogout();
    }
  };

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(0);
  }, [category]);

  // Fetch when category or currentPage changes
  useEffect(() => {
    fetchProducts(category, currentPage);
  }, [category, currentPage]);

  // ===== CATEGORY CHANGE =====
  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setCategory(selected);
    // currentPage resets to 0 via useEffect above, which triggers fetch
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  // ===== CONFIRM DELETE =====
  const handleConfirmDelete = async () => {
    try {
      const res = await api.delete(
        `/product-service/api/admin/deleteproduct/${deleteProduct.id}`
      );

      setServerMessage(res.data);
      setDeleteProduct(null);

      // After delete, if current page is now empty go back one page
      const newTotal = totalElements - 1;
      const newTotalPages = Math.ceil(newTotal / pageSize);
      const safePage = currentPage >= newTotalPages ? Math.max(0, newTotalPages - 1) : currentPage;
      setCurrentPage(safePage);

      setTimeout(() => setServerMessage(""), 3000);
    } catch (err) {
      setServerMessage("Failed to delete product");
      setTimeout(() => setServerMessage(""), 3000);
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="admin-container">
      {/* ===== NAVBAR ===== */}
      <header className="admin-navbar">
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <h1 className="logo">AzCart Admin</h1>
      </header>

      {/* ===== SIDEBAR ===== */}
      <aside className={`admin-sidebar ${menuOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => navigate("/admin")}>🏠 Home</li>
          <li onClick={() => navigate("/admin/profile")}>👤 Personal Info</li>
          <li onClick={() => navigate("/admin/add-product")}>➕ Add Product</li>
          <li onClick={() => navigate("/admin/products")}>📦 Manage Products</li>
          <li onClick={() => navigate("/admin/orders")}>🧾 Manage Orders</li>
          <li onClick={() => navigate("/admin/change-password")}>🔑 Change Password</li>
          <li className="danger" onClick={() => navigate("/admin/delete-account")}>🗑 Delete Account</li>
          <li className="logout" onClick={handleLogout}>🚪 Logout</li>
        </ul>
      </aside>

      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* ===== MAIN CONTENT ===== */}
      <main className="admin-content">
        {/* ===== SERVER MESSAGE ===== */}
        {serverMessage && (
          <div className="server-message">{serverMessage}</div>
        )}

        {/* ===== HEADER + FILTER ===== */}
        <div className="products-header">
          <div>
            <h2>Manage Products</h2>
            {totalElements > 0 && (
              <p>
                Showing {currentPage * pageSize + 1}–
                {Math.min((currentPage + 1) * pageSize, totalElements)} of{" "}
                {totalElements} products
              </p>
            )}
          </div>

          <div className="filter-wrapper">
            <span className="filter-icon">🔽</span>
            <select
              className="category-filter"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="all">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Books">Books</option>
              <option value="Furniture">Furniture</option>
              <option value="Sports">Sports</option>
              <option value="Applicances">Applicances</option>
            </select>
          </div>
        </div>

        {/* ===== PRODUCT GRID ===== */}
        <div className="product-grid">
          {products.length === 0 ? (
            <p>No products found</p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className={`product-card ${product.stock === 0 ? "out-of-stock" : ""}`}
              >
                {product.stock === 0 && (
                  <span className="stock-badge">Out of Stock</span>
                )}

                <img
                  src={`http://localhost:8765/product-service/api/products/image/${product.id}`}
                  alt={product.productname}
                  className="product-image"
                />

                <p className="product-name">{product.productname}</p>
                <p className="product-price">₹ {product.price}</p>

                <div className="card-actions">
                  <button
                    className="icon-btn edit-btn"
                    title="Edit Product"
                    onClick={() => navigate(`/admin/edit-product/${product.id}`)}
                  >
                    ✏️
                  </button>

                  <button
                    className="icon-btn delete-btn"
                    title="Delete Product"
                    onClick={() => setDeleteProduct(product)}
                  >
                    🗑
                  </button>
                </div>

                <p className="stock-text">Stock : {product.stock}</p>
              </div>
            ))
          )}
        </div>

        {/* ===== PAGINATION CONTROLS ===== */}
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

            <span>Page {currentPage + 1} of {totalPages}</span>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              style={{
                padding: "8px 20px",
                cursor: currentPage === totalPages - 1 ? "not-allowed" : "pointer",
                opacity: currentPage === totalPages - 1 ? 0.5 : 1,
              }}
            >
              Next →
            </button>
          </div>
        )}
      </main>

      {/* ===== DELETE CONFIRM MODAL ===== */}
      {deleteProduct && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Product?</h3>
            <p>
              Are you sure you want to delete{" "}
              <b>{deleteProduct.productname}</b>?
            </p>

            <div className="modal-actions">
              <button onClick={() => setDeleteProduct(null)}>Cancel</button>
              <button className="danger" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
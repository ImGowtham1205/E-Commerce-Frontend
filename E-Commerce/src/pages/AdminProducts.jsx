import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/AdminProducts.css";

function AdminProducts() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");

  // 🛑 delete modal + server message
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [serverMessage, setServerMessage] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // ===== FETCH PRODUCTS =====
  const fetchProducts = async (selectedCategory = "all") => {
    try {
      const res =
        selectedCategory === "all"
          ? await api.get("/api/products")
          : await api.get(`/api/products/${selectedCategory}`);

      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
      handleLogout();
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ===== CATEGORY CHANGE =====
  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setCategory(selected);
    fetchProducts(selected);
  };

  // ===== CONFIRM DELETE =====
  const handleConfirmDelete = async () => {
    try {
      const res = await api.delete(
        `/api/admin/deleteproduct/${deleteProduct.id}`
      );

      // show backend message
      setServerMessage(res.data);

      // close modal
      setDeleteProduct(null);

      // refresh list
      fetchProducts(category);

      // hide message after 3 sec
      setTimeout(() => {
        setServerMessage("");
      }, 3000);
    } catch (err) {
      setServerMessage("Failed to delete product");

      setTimeout(() => {
        setServerMessage("");
      }, 3000);

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
          <li onClick={() => navigate("/admin/profile")}>👤 Personal Info</li>
          <li onClick={() => navigate("/admin/add-product")}>➕ Add Product</li>
          <li onClick={() => navigate("/admin/products")}>📦 Manage Products</li>
          <li onClick={() => navigate("/admin/change-password")}>
            🔑 Change Password
          </li>
          <li
            className="danger"
            onClick={() => navigate("/admin/delete-account")}
          >
            🗑 Delete Account
          </li>
          <li className="logout" onClick={handleLogout}>
            🚪 Logout
          </li>
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
            <p>All available products in your store</p>
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
            </select>
          </div>
        </div>

        {/* ===== PRODUCT GRID ===== */}
        <div className="product-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className={`product-card ${
                product.stock === 0 ? "out-of-stock" : ""
              }`}
            >
              {/* 📦 OUT OF STOCK BADGE */}
              {product.stock === 0 && (
                <span className="stock-badge">Out of Stock</span>
              )}

              <img
                src={`http://localhost:8080/api/products/image/${product.id}`}
                alt={product.productname}
                className="product-image"
              />

              <p className="product-name">{product.productname}</p>
              <p className="product-price">₹ {product.price}</p>

              <div className="card-actions">
                <button
                  className="icon-btn edit-btn"
                  title="Edit Product"
                  onClick={() =>
                    navigate(`/admin/edit-product/${product.id}`)
                  }
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
          ))}
        </div>
      </main>

      {/* ===== 🛑 DELETE CONFIRM MODAL ===== */}
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

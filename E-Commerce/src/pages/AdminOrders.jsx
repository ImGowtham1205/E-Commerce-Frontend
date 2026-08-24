import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/AdminOrders.css";

function AdminOrders() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 5;

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

  // Fetch Orders + Products
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get(
          `/order-service/api/admin/fetchorders?page=${currentPage}&size=${pageSize}`
        );

        const orderList = res.data.content;
        setOrders(orderList);
        setTotalPages(res.data.page.totalPages);
        setTotalElements(res.data.page.totalElements);

        orderList.forEach(async (order) => {
          if (!products[order.productid]) {
            try {
              const prodRes = await api.get(
                `/product-service/api/products/details/${order.productid}`
              );
              setProducts((prev) => ({
                ...prev,
                [order.productid]: prodRes.data,
              }));
            } catch (err) {
              console.error("Product fetch error", err);
            }
          }
        });
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };

    fetchOrders();
  }, [currentPage]);

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="admin-container">
      {/* ===== NAVBAR ===== */}
      <header className="admin-navbar">
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
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

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}

      {/* ===== MAIN CONTENT ===== */}
      <main className="admin-content">
        <h2 className="page-title">📦 All Orders</h2>

        {/* Results count */}
        {totalElements > 0 && (
          <p style={{ color: "#888", marginBottom: "16px" }}>
            Showing {currentPage * pageSize + 1}–
            {Math.min((currentPage + 1) * pageSize, totalElements)} of{" "}
            {totalElements} orders
          </p>
        )}

        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Product</th>
                <th>Price</th>
                <th>Image</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const product = products[order.productid];
                return (
                  <tr key={order.orderid}>
                    <td>{order.orderid}</td>
                    <td>{order.username}</td>
                    <td>{order.phoneno}</td>
                    <td className="address-col">{order.address}</td>
                    <td className="product-col">
                      <div className="product-text" title={product?.productname}>
                        {product?.productname || "Loading..."}
                      </div>
                    </td>
                    <td className="price-col">
                      ₹{product?.price?.toFixed(2) || "Loading..."}
                    </td>
                    <td className="image-col">
                      {product && (
                        <img
                          src={`http://localhost:8765/product-service/api/products/image/${order.productid}`}
                          alt="product"
                          className="order-img"
                        />
                      )}
                    </td>
                    <td className="success">{order.payment_Status}</td>
                    <td className={order.order_status.toLowerCase().replace(" ", "-")}>
                      {order.order_status}
                    </td>
                    <td>{order.orderdate}</td>
                    <td>{order.ordertime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ===== PAGINATION CONTROLS ===== */}
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "30px" }}>
            <button onClick={handlePrev} disabled={currentPage === 0}
              style={{ padding: "8px 20px", cursor: currentPage === 0 ? "not-allowed" : "pointer", opacity: currentPage === 0 ? 0.5 : 1 }}>
              ← Prev
            </button>
            <span>Page {currentPage + 1} of {totalPages}</span>
            <button onClick={handleNext} disabled={currentPage === totalPages - 1}
              style={{ padding: "8px 20px", cursor: currentPage === totalPages - 1 ? "not-allowed" : "pointer", opacity: currentPage === totalPages - 1 ? 0.5 : 1 }}>
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminOrders;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/AdminOrders.css";

function AdminOrders() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const navigate = useNavigate();

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Fetch Orders + Products
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/api/admin/fetchorders");
        setOrders(res.data);

        res.data.forEach(async (order) => {
          if (!products[order.productid]) {
            const prodRes = await api.get(
              `/api/products/details/${order.productid}`
            );
            setProducts((prev) => ({
              ...prev,
              [order.productid]: prodRes.data,
            }));
          }
        });
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };

    fetchOrders();
  }, []);

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

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}

      {/* ===== MAIN CONTENT ===== */}
      <main className="admin-content">
        <h2 className="page-title">📦 All Orders</h2>

        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Product</th>
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

                    {/* ✅ PRODUCT FIX */}
                    <td className="product-col">
                      <div
                        className="product-text"
                        title={product?.productname}
                      >
                        {product?.productname || "Loading..."}
                      </div>
                    </td>

                    {/* ✅ IMAGE FIX */}
                    <td className="image-col">
                      {product && (
                        <img
                          src={`http://localhost:8080/api/products/image/${order.productid}`}
                          alt="product"
                          className="order-img"
                        />
                      )}
                    </td>

                    <td className="success">{order.payment_Status}</td>

                    <td
                      className={
                        order.order_status
                          .toLowerCase()
                          .replace(" ", "-")
                      }
                    >
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
      </main>
    </div>
  );
}

export default AdminOrders;

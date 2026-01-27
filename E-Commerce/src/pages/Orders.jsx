import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/Welcome.css";
import "../styles/Orders.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Orders() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [welcomeText, setWelcomeText] = useState(""); // Welcome API text

  const navigate = useNavigate();

  // Cancel Popup State
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Fetch Welcome Text
  useEffect(() => {
    const fetchWelcome = async () => {
      try {
        const res = await api.get("/api/user/home");
        setWelcomeText(res.data);
      } catch (err) {
        console.error("Welcome API error", err);
      }
    };

    fetchWelcome();
  }, []);

  // Fetch Orders + Products
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/api/user/fetchorder");
        setOrders(res.data);

        // Fetch product details for each order
        res.data.forEach(async (order) => {
          try {
            const productRes = await api.get(
              `/api/products/details/${order.productid}`
            );

            setProducts((prev) => ({
              ...prev,
              [order.productid]: productRes.data,
            }));
          } catch (err) {
            console.error("Product fetch error", err);
          }
        });
      } catch (err) {
        console.error("Orders fetch error", err);
        toast.error("Failed to load orders");
      }
    };

    fetchOrders();
  }, []);

  // Open Cancel Popup
  const openCancelPopup = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelPopup(true);
  };

  // Confirm Cancel Order
  const confirmCancelOrder = async () => {
    const toastId = toast.loading("Cancelling order...");

    try {
      await api.delete(`/api/user/cancelorder/${selectedOrderId}`);

      // Update order status in UI
      setOrders((prev) =>
        prev.map((o) =>
          o.orderid === selectedOrderId
            ? { ...o, order_status: "CANCELLED" }
            : o
        )
      );

      toast.update(toastId, {
        render: "Order cancelled successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setShowCancelPopup(false);
    } catch (err) {
      console.error("Cancel failed", err);

      toast.update(toastId, {
        render: "Failed to cancel order",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notifications */}
      <ToastContainer position="top-right" />

      {/* ===== NAVBAR ===== */}
      <header className="navbar">
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        {/* Welcome Text from API */}
        <h1 className="welcome-text">
          {welcomeText || "Welcome"}
        </h1>
      </header>

      {/* ===== SIDEBAR ===== */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => navigate("/welcome")}>🏠 Home</li>
          <li onClick={() => navigate("/userinfo")}>👤 Personal Info</li>
          <li onClick={() => navigate("/cart")}>🛒 Cart</li>
          <li onClick={() => navigate("/changepassword")}>🔑 Change Password</li>
          <li className="danger">🗑 Delete Account</li>
          <li className="logout" onClick={handleLogout}>🚪 Logout</li>
        </ul>
      </aside>

      {/* Overlay */}
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}

      {/* ===== MAIN CONTENT ===== */}
      <main className="content">
        <h2 className="orders-title">My Orders</h2>

        {orders.length === 0 ? (
          <p className="no-orders">You have no orders yet.</p>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => {
              const product = products[order.productid];

              return (
                <div key={order.orderid} className="order-card">
                  {/* Product Image */}
                  <img
                    src={`${api.defaults.baseURL}/api/products/image/${order.productid}`}
                    alt="Product"
                  />

                  {/* Order Details */}
                  <div className="order-info">
                    <h3>{product ? product.name : "Loading..."}</h3>

                    <p>💰 Price: ₹{product ? product.price : "Loading..."}</p>
                    <p>🆔 Order ID: {order.orderid}</p>
                    <p>📅 Date: {order.orderdate}</p>
                    <p>⏰ Time: {order.ordertime}</p>

                    <p>💳 Payment Status: {order.payment_Status}</p>

                    {/* Status with Color */}
                    <p
                      className={`status ${
                        order.order_status === "DELIVERED"
                          ? "delivered"
                          : order.order_status === "CANCELLED"
                          ? "cancelled"
                          : "not-delivered"
                      }`}
                    >
                      📦 Order Status: {order.order_status}
                    </p>

                    {/* Cancel Button */}
                    {order.order_status === "NOT DELIVERED" && (
                      <button
                        className="cancel-btn"
                        onClick={() => openCancelPopup(order.orderid)}
                      >
                        ❌ Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ===== CANCEL CONFIRM POPUP ===== */}
      {showCancelPopup && (
        <div className="cancel-popup-overlay">
          <div className="cancel-popup">
            <h3>Cancel Order?</h3>
            <p>Are you sure you want to cancel this order?</p>

            <div className="popup-buttons">
              <button
                className="btn-no"
                onClick={() => setShowCancelPopup(false)}
              >
                No
              </button>

              <button className="btn-yes" onClick={confirmCancelOrder}>
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/Welcome.css";
import "../styles/Cart.css";

function Cart() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [welcomeText, setWelcomeText] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grandTotal, setGrandTotal] = useState(0);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const navigate = useNavigate();

  /* ===== LOGOUT ===== */
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

  /* ===== INITIAL LOAD ===== */
  useEffect(() => {
    fetchWelcomeText();
    fetchGrandTotal();
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, [currentPage]);

  /* ===== FETCH WELCOME TEXT ===== */
  const fetchWelcomeText = async () => {
    try {
      const res = await api.get("/authservice/auth/api/user/home");
      setWelcomeText(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ===== FETCH GRAND TOTAL ===== */
  const fetchGrandTotal = async () => {
    try {
      const res = await api.get("/cart-service/api/user/carttotal");
      setGrandTotal(res.data);
    } catch (err) {
      console.error("Grand total fetch error", err);
    }
  };

  /* ===== FETCH CART ITEMS ===== */
  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const cartRes = await api.get(
        `/cart-service/api/user/getcartitem?page=${currentPage}&size=${pageSize}`
      );

      const cartList = cartRes.data.content;
      setTotalPages(cartRes.data.page.totalPages);
      setTotalElements(cartRes.data.page.totalElements);

      const enriched = await Promise.all(
        cartList.map(async (item) => {
          const productRes = await api.get(
            `/product-service/api/products/details/${item.productId}`
          );
          return {
            ...item,
            product: productRes.data,
            imageUrl: `${api.defaults.baseURL}/product-service/api/products/image/${item.productId}`,
          };
        })
      );

      setCartItems(enriched);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  /* ===== DELETE CART ITEM ===== */
  const deleteCartItem = async (e, cartId) => {
    e.stopPropagation();
    try {
      await api.delete("/cart-service/api/user/deletecartitem", {
        data: cartId,
      });

      // If last item on current page, go back one page
      if (cartItems.length === 1 && currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchCartItems();
      }

      fetchGrandTotal(); // refresh grand total after delete
    } catch (err) {
      console.error(err);
    }
  };

  /* ===== UPDATE QUANTITY ===== */
  const updateQuantity = async (e, cartId, productId, userId, quantity) => {
    e.stopPropagation();
    if (quantity < 1) return;

    try {
      await api.put("/cart-service/api/user/updatequantity", {
        id: cartId,
        productId,
        userId,
        quantity,
      });

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartId ? { ...item, quantity } : item
        )
      );

      fetchGrandTotal(); // refresh grand total after quantity change
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      {/* ===== NAVBAR ===== */}
      <header className="navbar">
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <h1 className="logo">{welcomeText}</h1>
      </header>

      {/* ===== SIDEBAR ===== */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => navigate("/welcome")}>🏠 Home</li>
          <li onClick={() => navigate("/userinfo")}>👤 Personal Info</li>
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

      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* ===== CONTENT ===== */}
      <main className="content">
        <h2>Your Cart</h2>

        {/* Items count */}
        {totalElements > 0 && (
          <p style={{ color: "#888", marginBottom: "16px" }}>
            Showing {currentPage * pageSize + 1}–
            {Math.min((currentPage + 1) * pageSize, totalElements)} of{" "}
            {totalElements} items
          </p>
        )}

        {loading ? (
          <p>Loading cart...</p>
        ) : cartItems.length === 0 ? (
          <p className="empty-cart">Your cart is empty</p>
        ) : (
          <>
            <div className="cart-list">
              {cartItems.map((item) => (
                <div
                  className="cart-card clickable"
                  key={item.id}
                  onClick={() => navigate(`/product/${item.productId}`)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.product.productname}
                    className="cart-image"
                  />

                  <div className="cart-info">
                    <h3>{item.product.productname}</h3>
                    <p className="price">₹ {item.product.price}</p>

                    <div className="qty-controls">
                      <button
                        onClick={(e) =>
                          updateQuantity(
                            e,
                            item.id,
                            item.productId,
                            item.userId,
                            item.quantity - 1
                          )
                        }
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={(e) =>
                          updateQuantity(
                            e,
                            item.id,
                            item.productId,
                            item.userId,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={(e) => deleteCartItem(e, item.id)}
                  >
                    ✖ Delete
                  </button>
                </div>
              ))}
            </div>

            {/* ===== GRAND TOTAL ===== */}
            <div className="cart-total">
              <span>Grand Total</span>
              <span>₹ {grandTotal.toFixed(2)}</span>
            </div>

            {/* ===== PAGINATION CONTROLS ===== */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "16px",
                  marginTop: "20px",
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
                      currentPage === totalPages - 1
                        ? "not-allowed"
                        : "pointer",
                    opacity: currentPage === totalPages - 1 ? 0.5 : 1,
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Cart;
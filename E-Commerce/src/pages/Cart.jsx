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
    fetchCartItems();
  }, []);

  /* ===== FETCH WELCOME TEXT ===== */
  const fetchWelcomeText = async () => {
    try {
      const res = await api.get("/authservice/auth/api/user/home");
      setWelcomeText(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ===== FETCH CART ITEMS ===== */
  const fetchCartItems = async () => {
    try {
      const cartRes = await api.get("/cart-service/api/user/getcartitem");

      const enriched = await Promise.all(
        cartRes.data.map(async (item) => {
          const productRes = await api.get(
            `/product-service/api/products/details/${item.productId}`
          );

          return {
            ...item,
            product: productRes.data,
            imageUrl: `${api.defaults.baseURL}/product-service/api/products/image/${item.productId}`
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

  /* ===== DELETE CART ITEM ===== */
  const deleteCartItem = async (e, cartId) => {
    e.stopPropagation(); 

    try {
      await api.delete("/cart-service/api/user/deletecartitem", {
        data: cartId
      });

      setCartItems((prev) =>
        prev.filter((item) => item.id !== cartId)
      );
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
        quantity
      });

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartId ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ===== TOTAL AMOUNT ===== */
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="app-container">
      {/* ===== NAVBAR ===== */}
      <header className="navbar">
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
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
          <li onClick={() => navigate("/changepassword")}>
            🔑 Change Password
          </li>
          <li className="danger" onClick={() => navigate("/delete-account")}>🗑 Delete Account</li>
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

            {/* ===== CART TOTAL ===== */}
            <div className="cart-total">
              <span>Total Amount</span>
              <span>₹ {totalAmount}</span>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Cart;

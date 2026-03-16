import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/Welcome.css";
import "../styles/ProductDetails.css";

function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [welcomeText, setWelcomeText] = useState("");
  const [userId, setUserId] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [commentCount, setCommentCount] = useState(0);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {
    try {
      await api.post("/api/user/logout");
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  /* ================= LOAD DATA ================= */

  useEffect(() => {

    const fetchData = async () => {

      const welcomeRes = await api.get("/api/user/home");
      setWelcomeText(welcomeRes.data);

      const productRes = await api.get(`/api/products/details/${id}`);
      setProduct(productRes.data);

      const userRes = await api.get("/api/user/getuserid");
      setUserId(userRes.data);

    };

    fetchData();

  }, [id]);

  /* ================= REVIEWS ================= */

  useEffect(() => {
    if (product) {
      fetchComments();
      fetchCommentCount();
    }
  }, [product]);

  const fetchComments = async () => {
    const res = await api.get(`/api/user/getcomments/${product.id}`);
    setReviews(res.data);
  };

  const fetchCommentCount = async () => {
    const res = await api.get(`/api/user/commentcount/${product.id}`);
    setCommentCount(res.data);
  };

  /* ================= MESSAGE ANIMATION ================= */

  useEffect(() => {

    if (message) {

      setShowMessage(true);

      const hide = setTimeout(() => setShowMessage(false), 2500);
      const clear = setTimeout(() => setMessage(""), 3000);

      return () => {
        clearTimeout(hide);
        clearTimeout(clear);
      };

    }

  }, [message]);

  /* ================= ADD TO CART ================= */

  const handleAddToCart = async () => {

    if (product.stock === 0) {
      setMessage("Out of stock");
      return;
    }

    const res = await api.post("/api/user/addtocart", {
      productId: product.id,
      quantity: 1
    });

    setMessage(res.data);

  };

  /* ================= BUY NOW ================= */

  const handleBuyNow = () => {

    if (product.stock === 0) {
      setMessage("Out of stock");
      return;
    }

    setShowPayment(true);

  };

  /* ================= COD ORDER ================= */

  const handleCOD = async () => {

    try {

      const res = await api.post(`/api/user/purchase/${product.id}`, {
        userid: userId,
        paymentmethod: "COD"
      });

      setMessage(res.data);
      setShowPayment(false);

    } catch {

      setMessage("Order failed");

    }

  };

  /* ================= RAZORPAY PAYMENT ================= */

  const handleRazorpayPayment = async () => {

    try {

      const orderRes = await api.post("/api/user/create", {
        amount: Number(product.price),
        userid: Number(userId)
      });

      const order = orderRes.data;

      const options = {

        key: import.meta.env.VITE_RAZORPAY_CLIENT_ID,

        amount: order.amount,
        currency: "INR",

        name: "AZCart",
        description: product.productname,

        order_id: order.id,

        handler: async function (response) {

          try {

            const verifyRes = await api.post("/api/user/verify", {

              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,

              productid: String(product.id),
              userid: String(userId)

            });

            if (verifyRes.data === "Payment successful") {

              setMessage("Payment successful!");
              setShowPayment(false);

              navigate("/orders");

            } else {

              setMessage("Payment verification failed");

            }

          } catch (err) {

            console.error(err);
            setMessage("Payment verification failed");

          }

        },

        modal: {
          ondismiss: function () {
            setMessage("Payment cancelled");
          }
        }

      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {

      console.error(err);
      setMessage("Payment initialization failed");

    }

  };

  /* ================= REVIEW HANDLERS ================= */

  const handleAddReview = async () => {

    if (!reviewText.trim()) return;

    const res = await api.post("/api/user/addcomment", {
      userid: userId,
      productid: product.id,
      review: reviewText
    });

    setMessage(res.data);
    setReviewText("");

    fetchComments();
    fetchCommentCount();

  };

  const handleDeleteReview = async (commentId) => {

    const res = await api.delete(`/api/user/deletecomment/${commentId}`);

    setMessage(res.data);
    fetchComments();
    fetchCommentCount();

  };

  const handleEditReview = (comment) => {

    setEditingId(comment.id);
    setEditText(comment.review);

  };

  const handleUpdateReview = async () => {

    const res = await api.put("/api/user/updatecomment", {
      id: editingId,
      userid: userId,
      productid: product.id,
      review: editText
    });

    setMessage(res.data);
    setEditingId(null);

    fetchComments();

  };

  if (!product) return <p style={{ padding: 24 }}>Loading...</p>;

  return (

    <div className="app-container">

      <header className="navbar">
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <h1 className="logo">{welcomeText}</h1>
      </header>

      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => navigate("/welcome")}>🏠 Home</li>
          <li onClick={() => navigate("/userinfo")}>👤 Personal Info</li>
          <li onClick={() => navigate("/cart")}>🛒 Cart</li>
          <li onClick={() => navigate("/orders")}>📦 Orders</li>
          <li onClick={() => navigate("/changepassword")}>🔑 Change Password</li>
          <li className="danger" onClick={() => navigate("/delete-account")}>🗑 Delete Account</li>
          <li className="logout" onClick={handleLogout}>🚪 Logout</li>
        </ul>
      </aside>

      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)} />
      )}

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

            {message && (
              <p className={`cart-message ${showMessage ? "fade-in" : "fade-out"}`}>
                {message}
              </p>
            )}

            <div className="product-actions">

              <button className="buy-btn" onClick={handleBuyNow}>
                Buy Now
              </button>

              <button className="cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>

            </div>

            {/* PAYMENT MODAL */}

            {showPayment && (

              <div className="payment-modal">

                <div className="payment-container">

                  <h2>Select Payment Method</h2>

                  <div className="payment-options">

                    <div
                      className={`payment-card ${paymentMethod === "COD" ? "active" : ""}`}
                      onClick={() => setPaymentMethod("COD")}
                    >
                      Cash on Delivery
                    </div>

                    <div
                      className={`payment-card ${paymentMethod === "RAZORPAY" ? "active" : ""}`}
                      onClick={() => setPaymentMethod("RAZORPAY")}
                    >
                      Razorpay
                    </div>

                  </div>

                  {paymentMethod === "COD" && (
                    <button className="confirm-btn" onClick={handleCOD}>
                      Confirm Order
                    </button>
                  )}

                  {paymentMethod === "RAZORPAY" && (
                    <button className="confirm-btn" onClick={handleRazorpayPayment}>
                      Pay Now
                    </button>
                  )}

                  <button
                    className="cancel-btn"
                    onClick={() => setShowPayment(false)}
                  >
                    Cancel
                  </button>

                </div>

              </div>

            )}

            {/* REVIEWS */}

            <div className="review-section">

              <h3>Write a Review</h3>

              <textarea
                placeholder="Share your experience with this product"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />

              <button
                className="review-btn"
                disabled={!reviewText.trim()}
                onClick={handleAddReview}
              >
                Submit Review
              </button>

            </div>

            <div className="review-list">

              <h3>Customer Reviews ({commentCount})</h3>

              {reviews.length === 0 && <p>No reviews yet</p>}

              {reviews.map((cmt) => (

                <div key={cmt.id} className="review-card">

                  <div className="review-header">

                    <div className="review-avatar">
                      {cmt.username.charAt(0).toUpperCase()}
                    </div>

                    <div className="review-meta">
                      <span>{cmt.username}</span>
                    </div>

                    {cmt.userid === userId && editingId !== cmt.id && (
                      <div className="review-actions">
                        <button onClick={() => handleEditReview(cmt)}>Edit</button>
                        <button onClick={() => handleDeleteReview(cmt.id)}>Delete</button>
                      </div>
                    )}

                  </div>

                  {editingId === cmt.id ? (

                    <div>

                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />

                      <button onClick={handleUpdateReview}>Save</button>
                      <button onClick={() => setEditingId(null)}>Cancel</button>

                    </div>

                  ) : (

                    <p>{cmt.review}</p>

                  )}

                </div>

              ))}

            </div>

          </div>

        </div>

      </main>

    </div>

  );

}

export default ProductDetails;
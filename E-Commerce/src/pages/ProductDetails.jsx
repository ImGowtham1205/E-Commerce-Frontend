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

  const [userId, setUserId] = useState(null);

  // Review states
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [commentCount, setCommentCount] = useState(0);

  // ✏️ Edit review states
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  /* ===== Logout ===== */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  /* ===== Fetch Product + UserId ===== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const welcomeRes = await api.get("/api/user/home");
        setWelcomeText(welcomeRes.data);

        const productRes = await api.get(`/api/products/details/${id}`);
        setProduct(productRes.data);

        const userRes = await api.get("/api/user/getuserid");
        setUserId(userRes.data);
      } catch (err) {
        console.error("Error loading product page", err);
      }
    };
    fetchData();
  }, [id]);

  /* ===== Fetch Reviews ===== */
  useEffect(() => {
    if (product) {
      fetchComments();
      fetchCommentCount();
    }
  }, [product]);

  /* ===== Auto-hide Message ===== */
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

  /* ===== API Calls ===== */
  const fetchComments = async () => {
    const res = await api.get(`/api/user/getcomments/${product.id}`);
    setReviews(res.data);
  };

  const fetchCommentCount = async () => {
    const res = await api.get(`/api/user/commentcount/${product.id}`);
    setCommentCount(res.data);
  };

  const handleAddToCart = async () => {
    if (product.stock === 0) return;
    const res = await api.post("/api/user/addtocart", {
      productId: product.id,
      quantity: 1,
    });
    setMessage(res.data);
  };

  /* ===== Add Review ===== */
  const handleAddReview = async () => {
    if (!reviewText.trim()) return;

    const res = await api.post("/api/user/addcomment", {
      userid: userId,
      productid: product.id,
      review: reviewText,
    });

    setMessage(res.data);
    setReviewText("");
    fetchComments();
    fetchCommentCount();
  };

  /* ===== Delete Review ===== */
  const handleDeleteReview = async (commentId) => {
    const res = await api.delete(`/api/user/deletecomment/${commentId}`);
    setMessage(res.data);
    fetchComments();
    fetchCommentCount();
  };

  /* ===== Edit Review ===== */
  const handleEditReview = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.review);
  };

  const handleUpdateReview = async () => {
    if (!editText.trim()) return;

    const res = await api.put("/api/user/updatecomment", {
      id: editingId,
      userid: userId,
      productid: product.id,
      review: editText,
    });

    setMessage(res.data);
    setEditingId(null);
    setEditText("");
    fetchComments();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  if (!product) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <div className="app-container">
      {/* Navbar */}
      <header className="navbar">
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <h1 className="logo">{welcomeText}</h1>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => navigate("/welcome")}>🏠 Home</li>
          <li onClick={() => navigate("/userinfo")}>👤 Personal Info</li>
          <li onClick={() => navigate("/cart")}>🛒 Cart</li>
          <li>📦 Orders</li>
          <li onClick={() => navigate("/changepassword")}>🔑 Change Password</li>
          <li className="logout" onClick={handleLogout}>🚪 Logout</li>
        </ul>
      </aside>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}

      {/* Main Content */}
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
              <button className="buy-btn">Buy Now</button>
              <button className="cart-btn" onClick={handleAddToCart}>Add to Cart</button>
            </div>

            {/* Write Review */}
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

            {/* Reviews */}
            <div className="review-list">
              <h3>Customer Reviews ({commentCount})</h3>

              {reviews.length === 0 && (
                <p className="no-review">No reviews yet</p>
              )}

              {reviews.map((cmt) => (
                <div key={cmt.id} className="review-card">
                  <div className="review-header">
                    <div className="review-avatar">
                      {cmt.username.charAt(0).toUpperCase()}
                    </div>

                    <div className="review-meta">
                      <span className="review-user">{cmt.username}</span>
                      <span className="review-time">Just now</span>
                    </div>

                    {cmt.userid === userId && (
                      <div className="review-actions">
                        {editingId !== cmt.id && (
                          <>
                            <button
                              className="edit-review"
                              onClick={() => handleEditReview(cmt)}
                            >
                              Edit
                            </button>
                            <button
                              className="delete-review"
                              onClick={() => handleDeleteReview(cmt.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {editingId === cmt.id ? (
                    <div className="edit-review-box">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <div className="edit-actions">
                        <button className="save-btn" onClick={handleUpdateReview}>
                          Save
                        </button>
                        <button className="cancel-btn" onClick={handleCancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="review-text">{cmt.review}</p>
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

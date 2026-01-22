import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/AdminWelcome.css";
import "../styles/AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    productname: "",
    description: "",
    price: "",
    stock: "",
    category: ""
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // ⏱ Auto-clear messages
  useEffect(() => {
    if (success || Object.keys(errors).length > 0) {
      const timer = setTimeout(() => {
        setErrors({});
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, errors]);

  // 🔹 Input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // 🔹 Image select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setErrors({ ...errors, image: "" });
  };

  // 🔹 Remove image
  const removeImage = () => {
    setImage(null);
    setPreview(null);
    setErrors({ ...errors, image: "Product image is required" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 🔹 Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.productname.trim())
      newErrors.productname = "Product name is required";

    if (!formData.description.trim())
      newErrors.description = "Description is required";

    if (!formData.price)
      newErrors.price = "Price is required";
    else if (Number(formData.price) <= 0)
      newErrors.price = "Price must be greater than 0";

    if (!formData.stock)
      newErrors.stock = "Stock is required";
    else if (Number(formData.stock) < 0)
      newErrors.stock = "Stock cannot be negative";

    if (!formData.category)
      newErrors.category = "Category is required";

    if (!image)
      newErrors.image = "Product image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    if (!validateForm()) return;

    try {
      const data = new FormData();
      data.append(
        "product",
        new Blob([JSON.stringify(formData)], {
          type: "application/json"
        })
      );
      data.append("file", image);

      const res = await api.post("/api/admin/addproduct", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // ✅ Clear everything on success
      setSuccess(res.data);
      setFormData({
        productname: "",
        description: "",
        price: "",
        stock: "",
        category: ""
      });
      setImage(null);
      setPreview(null);
      setErrors({});
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      setErrors({ server: "Failed to add product" });
    }
  };

  return (
    <div className="admin-container">
      {/* NAVBAR */}
      <header className="admin-navbar">
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <h1 className="logo">AzCart Admin</h1>
      </header>

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${menuOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => navigate("/admin")}>🏠 Home</li>
          <li onClick={() => navigate("/admin/profile")}>👤 Personal Info</li>
          <li onClick={() => navigate("/admin/add-product")}>➕ Add Product</li>
           <li onClick={() => navigate("/admin/products")}>📦 Manage Products </li>
          <li onClick={() => navigate("/admin/change-password")}>🔑 Change Password</li>
          <li className="danger" onClick={() => navigate("/admin/delete-account")}>
            🗑 Delete Account
          </li>
          <li className="logout" onClick={handleLogout}>🚪 Logout</li>
        </ul>
      </aside>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}

      {/* MAIN */}
      <main className="admin-content">
        <h2>Add New Product</h2>
        <p>Fill product details and upload image</p>

        <form className="add-product-form" onSubmit={handleSubmit}>
          {errors.server && <p className="error">{errors.server}</p>}
          {success && <p className="success">{success}</p>}

          <input
            type="text"
            name="productname"
            placeholder="Product Name"
            value={formData.productname}
            onChange={handleChange}
            className={errors.productname ? "invalid" : ""}
          />
          {errors.productname && <p className="error">{errors.productname}</p>}

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? "invalid" : ""}
          />
          {errors.description && <p className="error">{errors.description}</p>}

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className={errors.price ? "invalid" : ""}
          />
          {errors.price && <p className="error">{errors.price}</p>}

          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={formData.stock}
            onChange={handleChange}
            className={errors.stock ? "invalid" : ""}
          />
          {errors.stock && <p className="error">{errors.stock}</p>}

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? "invalid" : ""}
          >
            <option value="">-- Select Category --</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
            <option value="Furniture">Furniture</option>
            <option value="Sports">Sports</option>
            <option value="Applicances">Applicances</option>
          </select>
          {errors.category && <p className="error">{errors.category}</p>}

          {/* 📸 IMAGE UPLOAD */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className={errors.image ? "invalid" : ""}
          />
          {errors.image && <p className="error">{errors.image}</p>}

          {/* 👁 IMAGE PREVIEW */}
          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Preview" />
              <button type="button" onClick={removeImage}>
                ✖ Remove Image
              </button>
            </div>
          )}

          <button type="submit">Add Product</button>
        </form>
      </main>
    </div>
  );
}

export default AddProduct;

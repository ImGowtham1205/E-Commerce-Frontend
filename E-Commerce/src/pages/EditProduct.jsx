import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/AdminWelcome.css";
import "../styles/AddProduct.css";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    productname: "",
    description: "",
    price: "",
    stock: "",
    category: ""
  });

  const [image, setImage] = useState(null); // optional
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  /* ===== LOAD PRODUCT ===== */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/products/details/${id}`);
        setFormData(res.data);
        setPreview(`http://localhost:8080/api/products/image/${id}`);
      } catch (err) {
        console.error("Failed to load product", err);
      }
    };
    fetchProduct();
  }, [id]);

  /* ===== INPUT CHANGE ===== */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  /* ===== IMAGE CHANGE (OPTIONAL) ===== */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ===== VALIDATION ===== */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.productname.trim())
      newErrors.productname = "Product name is required";

    if (!formData.description.trim())
      newErrors.description = "Description is required";

    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = "Valid price required";

    if (formData.stock < 0)
      newErrors.stock = "Stock cannot be negative";

    if (!formData.category)
      newErrors.category = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ===== UPDATE PRODUCT ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const data = new FormData();
      data.append(
        "product",
        new Blob([JSON.stringify(formData)], {
          type: "application/json"
        })
      );

      // only append file if admin selected new image
      if (image) {
        data.append("file", image);
      }

      const res = await api.put("/api/admin/updateproduct", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setServerMessage(res.data);

      setTimeout(() => {
        navigate("/admin/products");
      }, 3000);
    } catch (err) {
      console.error(err);
      setServerMessage("Failed to update product");
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-navbar">
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <h1 className="logo">AzCart Admin</h1>
      </header>

      <aside className={`admin-sidebar ${menuOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => navigate("/admin")}>Home</li>
          <li onClick={() => navigate("/admin/profile")}>Personal Info</li>
          <li onClick={() => navigate("/admin/add-product")}>Add Product</li>
          <li onClick={() => navigate("/admin/products")}>Manage Products</li>
          <li onClick={() => navigate("/admin/change-password")}>
            Change Password
          </li>
          <li className="logout" onClick={handleLogout}>Logout</li>
        </ul>
      </aside>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}

      <main className="admin-content">
        <h2>Edit Product</h2>
        <p>Update product details</p>

        {serverMessage && <p className="success">{serverMessage}</p>}

        <form className="add-product-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="productname"
            value={formData.productname}
            onChange={handleChange}
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />

          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">-- Select Category --</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
          </select>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
          />

          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Preview" />
            </div>
          )}

          <button type="submit">Update Product</button>
        </form>
      </main>
    </div>
  );
}

export default EditProduct;

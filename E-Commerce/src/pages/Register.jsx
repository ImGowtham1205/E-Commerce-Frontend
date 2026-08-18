import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";
import logo from "../assets/azcart-logo.jpeg";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneno: "",
    address: "",
    password: "",
    role: "USER",
    adminkey: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Password validation
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  // Show/hide toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);

  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Auto clear messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    if (name === "password") {
      setPasswordTouched(true);
      setIsPasswordValid(passwordPattern.test(value));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phoneno, address, password, role, adminkey } = formData;

    // Common required fields regardless of role
    if (!name || !email || !phoneno || !password || !role) {
      setError("All fields are required");
      return;
    }

    // Role-specific required field checks
    if (role === "USER" && !address) {
      setError("Address is required for user accounts");
      return;
    }

    if (role === "ADMIN" && !adminkey) {
      setError("Admin key is required for admin accounts");
      return;
    }

    if (!isPasswordValid) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8765/authservice/auth/register",
        formData,
        { validateStatus: () => true }
      );

      if (response.status === 201) {
        setSuccess(response.data);
        setTimeout(() => navigate("/login"), 1500);
      } else if (response.status === 409) {
        setError(response.data);
      } else if (response.status === 401) {
        setError(response.data);
      } else if (response.status === 400) {
        setError(response.data);
      } else {
        setError("Registration failed");
      }
    } catch {
      setError("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleSubmit} noValidate>
        <img src={logo} alt="AZCART Logo" className="register-logo" />

        <h2>Create Account</h2>

        {/* Role */}
        <div className="input-group">
          <label>Account Type</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {/* Name */}
        <div className="input-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone */}
        <div className="input-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phoneno"
            placeholder="Enter phone number"
            value={formData.phoneno}
            onChange={handleChange}
            required
          />
        </div>

        {/* Address - only shown/required for USER */}
        {formData.role === "USER" && (
          <div className="input-group">
            <label>Address</label>
            <textarea
              name="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
              required
            ></textarea>
          </div>
        )}

        {/* Admin Key - only relevant/required for ADMIN */}
        {formData.role === "ADMIN" && (
          <div className="input-group">
            <label>Admin Key</label>
            <div className="password-field">
              <input
                type={showAdminKey ? "text" : "password"}
                name="adminkey"
                placeholder="Enter admin key"
                value={formData.adminkey}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-eye-btn"
                onClick={() => setShowAdminKey((prev) => !prev)}
                tabIndex={-1}
                aria-label={showAdminKey ? "Hide admin key" : "Show admin key"}
              >
                {showAdminKey ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Password */}
        <div className="input-group">
          <label>Password</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-eye-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <p
            className={`password-hint ${
              passwordTouched
                ? isPasswordValid
                  ? "success"
                  : "error"
                : ""
            }`}
          >
            Minimum 8 characters, including uppercase, lowercase, number, and special character
          </p>
        </div>

        {/* Submit */}
        <button type="submit" className="register-btn" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {error && <p className="register-message error">{error}</p>}
        {success && <p className="register-message success">{success}</p>}

        <div className="login-text">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
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
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Password states
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  // Password regex
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phoneno, password } = formData;

    if (!name || !email || !phoneno || !password) {
      setError("All fields are required");
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
        "http://localhost:8080/register",
        formData,
        { validateStatus: () => true }
      );

      // SUCCESS
      if (response.status === 201) {
        setSuccess(response.data);
        setTimeout(() => navigate("/login"), 1500);
      }
      // BACKEND VALIDATION ERRORS
      else if (response.status === 409) {
        setError(response.data);
      }
      // OTHER ERRORS
      else {
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

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Password rule message */}
          <p
            className={`password-hint ${
              passwordTouched
                ? isPasswordValid
                  ? "success"
                  : "error"
                : ""
            }`}
          >
            Minimum 8 characters, including uppercase, lowercase, number, and
            special character
          </p>
        </div>

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

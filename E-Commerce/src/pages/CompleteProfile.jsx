import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/CompleteProfile.css";

function CompleteProfile() {

  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordRegex.test(password)) {
      setMessage(
        "Password must contain 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character."
      );
      return;
    }

    setLoading(true);

    try {

      const response = await api.put("/authservice/auth/api/user/complete-profile", {
        address: address.trim(),
        phoneno: phoneno.trim(),
        password: password.trim()
      });

      if (response.status === 200) {
        setMessage("Profile completed successfully!");

        setTimeout(() => {
          navigate("/welcome", { replace: true });
        }, 1500);
      }

    } catch (err) {

      if (err.response?.status === 409) {
        setMessage("Phone Number Already Exists");
      } else {
        setMessage("Failed to update profile.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">

      <form className="profile-card" onSubmit={handleSubmit}>

        <h2>Complete Your Profile</h2>

        <div className="input-group">
          <label>Phone Number</label>
          <input
            type="text"
            value={phoneno}
            placeholder="Enter phone number"
            onChange={(e) => setPhoneno(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Address</label>
          <textarea
            value={address}
            placeholder="Enter your address"
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            placeholder="Create password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Password Rules */}
        <div className="password-rules">
          <p>Password must contain:</p>
          <ul>
            <li>Minimum 8 characters</li>
            <li>1 uppercase letter</li>
            <li>1 lowercase letter</li>
            <li>1 number</li>
            <li>1 special character (@$!%*?&)</li>
          </ul>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Complete Profile"}
        </button>

        {message && <p className="profile-message">{message}</p>}

      </form>

    </div>
  );
}

export default CompleteProfile;
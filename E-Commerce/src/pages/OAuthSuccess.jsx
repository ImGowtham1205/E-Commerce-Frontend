import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

function OAuthSuccess() {

  const navigate = useNavigate();
  const executed = useRef(false);

  useEffect(() => {

    if (executed.current) return;
    executed.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const role = params.get("role");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // Save token and role
    localStorage.setItem("token", token);
    localStorage.setItem("role", role || "ROLE_USER");

    const checkProfile = async () => {

      try {

        const response = await api.get("/api/user/userinfo");

        const user = response.data;

        if (user.profileCompleted === true) {
          navigate("/complete-profile", { replace: true });
        } else {
          navigate("/welcome", { replace: true });
        }

      } catch (error) {
        console.error("User info fetch failed:", error);
        navigate("/login", { replace: true });
      }
    };

    checkProfile();

  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "120px" }}>
      <h2>Logging in with OAuth...</h2>
      <p>Please wait while we prepare your account.</p>
    </div>
  );
}

export default OAuthSuccess;
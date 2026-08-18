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

    // Clear token from the URL immediately so browser back/forward or
    // history replay can't re-trigger this flow with a stale token
    window.history.replaceState({}, document.title, "/oauth-success");

    const checkProfile = async () => {

      try {

        // Admins are never auto-created via OAuth (see ProcessOAuth2UsersService),
        // so an admin token always belongs to a pre-existing, fully set-up admin.
        // No profile-completion concept applies to them — send straight to the admin dashboard.
        if (role === "ROLE_ADMIN") {
          navigate("/admin", { replace: true });
          return;
        }

        const response = await api.get("/authservice/auth/api/user/userinfo");

        const user = response.data;

        if (user.profileCompleted === true) {
          navigate("/complete-profile", { replace: true });
        } else {
          navigate("/welcome", { replace: true });
        }

      } catch (error) {
        console.error("User info fetch failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
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
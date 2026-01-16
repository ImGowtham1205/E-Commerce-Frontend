import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ===== PUBLIC PAGES ===== */
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* ===== USER PAGES ===== */
import Welcome from "./pages/Welcome";
import ChangePassword from "./pages/ChangePassword";
import UserInfo from "./pages/UserInfo";
import CategoryProducts from "./pages/CategoryProducts";

/* ===== ADMIN PAGES ===== */
import AdminWelcome from "./pages/AdminWelcome";
import AdminProfile from "./pages/AdminProfile";
import AdminChangePassword from "./pages/AdminchangePassword";
import AddProducts from "./pages/AddProducts";

/* ===== ROUTE GUARDS ===== */
import UserRoute from "./pages/UserRoute";
import AdminRoute from "./pages/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== DEFAULT ===== */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ===== USER ROUTES ===== */}
        <Route
          path="/welcome"
          element={
            <UserRoute>
              <Welcome />
            </UserRoute>
          }
        />

        <Route
          path="/category/:category"
          element={
            <UserRoute>
              <CategoryProducts />
            </UserRoute>
          }
        />

        <Route
          path="/userinfo"
          element={
            <UserRoute>
              <UserInfo />
            </UserRoute>
          }
        />

        <Route
          path="/changepassword"
          element={
            <UserRoute>
              <ChangePassword />
            </UserRoute>
          }
        />

        {/* ===== ADMIN ROUTES ===== */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminWelcome />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <AdminRoute>
              <AdminProfile />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/add-product"
          element={
            <AdminRoute>
              <AddProducts />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/change-password"
          element={
            <AdminRoute>
              <AdminChangePassword />
            </AdminRoute>
          }
        />

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

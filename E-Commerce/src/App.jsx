import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Welcome from "./pages/Welcome";
import ChangePassword from "./pages/ChangePassword";
import UserInfo from "./pages/UserInfo";

import AdminWelcome from "./pages/AdminWelcome";
import AdminProfile from "./pages/AdminProfile";
import AdminChangePassword from "./pages/AdminchangePassword";

import UserRoute from "./pages/UserRoute";
import AdminRoute from "./pages/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* USER Routes */}
        <Route
          path="/welcome"
          element={
            <UserRoute>
              <Welcome />
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

        {/* ADMIN Routes */}
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
          path="/admin/change-password"
          element={
            <AdminRoute>
              <AdminChangePassword />
            </AdminRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Welcome from "./pages/Welcome";
import ChangePassword from "./pages/ChangePassword";
import UserInfo from "./pages/UserInfo";
import AdminWelcome from "./pages/AdminWelcome";

import UserRoute from "./pages/UserRoute";
import AdminRoute from "./pages/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public */}
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

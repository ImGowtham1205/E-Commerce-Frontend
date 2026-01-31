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
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import DeleteAccount from "./pages/DeleteAccount";

/* ===== ADMIN PAGES ===== */
import AdminWelcome from "./pages/AdminWelcome";
import AdminProfile from "./pages/AdminProfile";
import AdminChangePassword from "./pages/AdminchangePassword";
import AddProducts from "./pages/AddProducts";
import AdminProducts from "./pages/AdminProducts";
import EditProduct from "./pages/EditProduct";
import AdminOrders from "./pages/AdminOrders";
import AdminDeleteAccount from "./pages/AdminDeleteAccount"; // ✅ NEW

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
          path="/product/:id"
          element={
            <UserRoute>
              <ProductDetails />
            </UserRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <UserRoute>
              <Cart />
            </UserRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <UserRoute>
              <Orders />
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
        <Route
          path="/delete-account"
          element={
            <UserRoute>
              <DeleteAccount />
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
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/edit-product/:id"
          element={
            <AdminRoute>
              <EditProduct />
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
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />

        {/* ✅ ADMIN DELETE ACCOUNT */}
        <Route
          path="/admin/delete-account"
          element={
            <AdminRoute>
              <AdminDeleteAccount />
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

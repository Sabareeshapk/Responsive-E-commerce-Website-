import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminHome from "./pages/AdminHome";
import SellerHome from "./pages/SellerHome";
import UserHome from "./pages/UserHome";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import UserProfile from "./pages/USerProfile";
import AdminProfile from "./pages/AdminProfile";
import SellerProfile from "./pages/SellerProfile";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller"
          element={
            <ProtectedRoute role="seller">
              <SellerHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute role="user">
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute role="user">
              <Wishlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-profile"
          element={
            <ProtectedRoute role="user">
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-profile"
          element={
            <ProtectedRoute role="admin">
              <AdminProfile />
            </ProtectedRoute>
  }
  
/>
          <Route
            path="/seller-profile"
            element={
              <ProtectedRoute role="seller">
                <SellerProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute role="user">
                <Checkout />
              </ProtectedRoute>
            }
          />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/SellerProfile.css";

function SellerProfile() {
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const products = JSON.parse(localStorage.getItem("products")) || [];

  const sellerProducts = products.filter(
    (product) => product.sellerEmail === loggedInUser.email
  );

  const totalProducts = sellerProducts.length;
  const inStock = sellerProducts.filter(
    (p) => p.availability === "In Stock"
  ).length;
  const outStock = sellerProducts.filter(
    (p) => p.availability === "Out of Stock"
  ).length;

  const [profileData, setProfileData] = useState({
    name: loggedInUser.name || "",
    email: loggedInUser.email || "",
    role: loggedInUser.role || "",
    phone: loggedInUser.phone || "",
    storeName: loggedInUser.storeName || ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  // Save profile
  const handleSaveProfile = () => {
    const updatedUsers = users.map((user) =>
      user.email === loggedInUser.email
        ? { ...user, ...profileData }
        : user
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem(
      "loggedInUser",
      JSON.stringify({ ...loggedInUser, ...profileData })
    );

    setMessage("Profile updated successfully!");
  };

  // Change password
  const handleChangePassword = () => {
    if (passwordData.currentPassword !== loggedInUser.password) {
      setMessage("Current password is incorrect");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const updatedUsers = users.map((user) =>
      user.email === loggedInUser.email
        ? { ...user, password: passwordData.newPassword }
        : user
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem(
      "loggedInUser",
      JSON.stringify({ ...loggedInUser, password: passwordData.newPassword })
    );

    setMessage("Password updated successfully!");
  };

  return (
    <div className="seller-profile-container">
      <div className="seller-profile-card">
        <h1>Seller Profile </h1>

        {message && <p className="success-msg">{message}</p>}

        {/* Personal Info */}
        <div className="section">
          <h2>Personal Information</h2>

          <label>Name</label>
          <input name="name" value={profileData.name} onChange={handleChange} />

          <label>Email</label>
          <input value={profileData.email} readOnly />

          <label>Role</label>
          <input value={profileData.role} readOnly />

          <label>Phone</label>
          <input name="phone" value={profileData.phone} onChange={handleChange} />

          <label>Store Name</label>
          <input name="storeName" value={profileData.storeName} onChange={handleChange} />

          <button className="save-btn" onClick={handleSaveProfile}>
            Save Profile
          </button>
        </div>

        {/* Seller Stats */}
        <div className="section">
          <h2>Store Summary</h2>

          <div className="stats-grid">
            <div className="stat-box">
              <h3>{totalProducts}</h3>
              <p>Total Products</p>
            </div>

            <div className="stat-box">
              <h3>{inStock}</h3>
              <p>In Stock</p>
            </div>

            <div className="stat-box">
              <h3>{outStock}</h3>
              <p>Out of Stock</p>
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="section">
          <h2>Change Password</h2>

          <input
            type="password"
            placeholder="Current Password"
            name="currentPassword"
            onChange={handlePasswordChange}
          />

          <input
            type="password"
            placeholder="New Password"
            name="newPassword"
            onChange={handlePasswordChange}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={handlePasswordChange}
          />

          <button className="password-btn" onClick={handleChangePassword}>
            Update Password
          </button>
        </div>

        <button className="back-btn" onClick={() => navigate("/seller")}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default SellerProfile;
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
    storeName: loggedInUser.storeName || "",
    profilePic: loggedInUser.profilePic || ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");

  // Handle profile input change
  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileData((prev) => ({
        ...prev,
        profilePic: reader.result
      }));
    };

    reader.readAsDataURL(file);
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
      JSON.stringify({
        ...loggedInUser,
        ...profileData,
        password: passwordData.newPassword
      })
    );

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });

    setMessage("Password updated successfully!");
  };

  return (
    <div className="seller-profile-container">
      <div className="seller-profile-card">
        <h1>Seller Profile</h1>

        {message && <p className="success-msg">{message}</p>}

        {/* Profile Picture */}
        <div className="profile-pic-section">
          <img
            src={
              profileData.profilePic ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Profile"
            className="profile-pic"
          />

          <label className="upload-btn">
            Upload Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              hidden
            />
          </label>
        </div>

        {/* Personal Info */}
        <div className="section">
          <h2>Personal Information</h2>

          <label>Name</label>
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleChange}
          />

          <label>Email</label>
          <input type="email" value={profileData.email} readOnly />

          <label>Role</label>
          <input type="text" value={profileData.role} readOnly />

          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={profileData.phone}
            onChange={handleChange}
          />

          <label>Store Name</label>
          <input
            type="text"
            name="storeName"
            value={profileData.storeName}
            onChange={handleChange}
          />

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

        {/* Change Password */}
        <div className="section">
          <h2>Change Password</h2>

          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
          />

          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
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
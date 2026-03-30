import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/UserProfile.css";

function UserProfile() {
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const [profileData, setProfileData] = useState({
    name: loggedInUser.name || "",
    email: loggedInUser.email || "",
    role: loggedInUser.role || "",
    phone: loggedInUser.phone || "",
    address: loggedInUser.address || "",
    city: loggedInUser.city || "",
    state: loggedInUser.state || "",
    pincode: loggedInUser.pincode || "",
    profilePic: loggedInUser.profilePic || ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");

  // Handle profile input change
  const handleProfileChange = (e) => {
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
      setMessage("New passwords do not match");
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

    setMessage("Password changed successfully!");
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>My Profile</h1>

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
        <div className="profile-section">
          <h2>Personal Information</h2>

          <label>Name</label>
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleProfileChange}
          />

          <label>Email</label>
          <input type="email" value={profileData.email} readOnly />

          <label>Role</label>
          <input type="text" value={profileData.role} readOnly />

          <label>Phone Number</label>
          <input
            type="text"
            name="phone"
            value={profileData.phone}
            onChange={handleProfileChange}
          />
        </div>

        {/* Address Info */}
        <div className="profile-section">
          <h2>Address Information</h2>

          <label>Address</label>
          <input
            type="text"
            name="address"
            value={profileData.address}
            onChange={handleProfileChange}
          />

          <label>City</label>
          <input
            type="text"
            name="city"
            value={profileData.city}
            onChange={handleProfileChange}
          />

          <label>State</label>
          <input
            type="text"
            name="state"
            value={profileData.state}
            onChange={handleProfileChange}
          />

          <label>Pincode</label>
          <input
            type="text"
            name="pincode"
            value={profileData.pincode}
            onChange={handleProfileChange}
          />

          <button className="save-btn" onClick={handleSaveProfile}>
            Save Profile
          </button>
        </div>

        {/* Change Password */}
        <div className="profile-section">
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

          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
          />

          <button className="password-btn" onClick={handleChangePassword}>
            Change Password
          </button>
        </div>

        <button className="back-btn" onClick={() => navigate("/user")}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
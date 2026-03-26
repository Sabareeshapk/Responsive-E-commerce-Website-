import { useNavigate } from "react-router-dom";
import "../Styles/Admin.css";
import { useEffect, useState, useRef } from "react";

function AdminHome() {
  const navigate = useNavigate();

  // Refs for scrolling
  const sellerRef = useRef(null);
  const usersRef = useRef(null); // ✅ FIX ADDED
  const reportRef = useRef(null);

  // Scroll functions
  const scrollToSellers = () => {
    sellerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToUsers = () => {
    usersRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToReports = () => {
  reportRef.current?.scrollIntoView({ behavior: "smooth" });
};

  // Sidebar toggle
  const [isOpen, setIsOpen] = useState(true);

  // Notifications
  const [notifications, setNotifications] = useState([]);

  // Users data
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const [allUsers, setAllUsers] = useState(users);

  // Products
  const products = JSON.parse(localStorage.getItem("products")) || [];

  // Filters
  const sellers = allUsers.filter((u) => u.role === "seller");
  const normalUsers = allUsers.filter((u) => u.role === "user");

  // Counts
  const totalUsers = normalUsers.length;
  const totalSellers = sellers.length;
  const totalAdmins = allUsers.filter((u) => u.role === "admin").length;
  const totalProducts = products.length;

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [editedName, setEditedName] = useState("");

  // Notifications load + clear
  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem("notifications")) || [];

    setNotifications(data);

    if (data.length > 0) {
      localStorage.removeItem("notifications");
    }
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  // Delete seller
  const handleDeleteSeller = (email) => {
    const updatedUsers = allUsers.filter((u) => u.email !== email);

    setAllUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleEditSeller = (seller) => {
  setSelectedSeller(seller);
  setEditedName(seller.name);
  setShowEditModal(true);
};

const handleSaveSeller = () => {
  const updatedUsers = allUsers.map((user) =>
    user.email === selectedSeller.email
      ? { ...user, name: editedName }
      : user
  );

  setAllUsers(updatedUsers);
  localStorage.setItem("users", JSON.stringify(updatedUsers));

  setShowEditModal(false);
  setSelectedSeller(null);
  setEditedName("");
};

  return (
    <div className="admin-container">

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <h2>Admin</h2>
        <button>Dashboard</button>
        <button onClick={() => navigate("/admin-profile")}>Profile</button>
        <button onClick={scrollToUsers}>Users</button>
        <button onClick={scrollToSellers}>Sellers</button>
        <button onClick={scrollToReports}>Reports</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Main Content */}
      <div className="main-content">

        {/* Toggle */}
        <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✖" : "☰"}
        </button>

        <h1>Dashboard Overview</h1>

        {/* Cards */}
        <div className="cards">
          <div className="card">
            <h2>{totalUsers}</h2>
            <p>Total Users</p>
          </div>

          <div className="card">
            <h2>{totalSellers}</h2>
            <p>Total Sellers</p>
          </div>

          <div className="card">
            <h2>{totalProducts}</h2>
            <p>Total Products</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="notifications">
          <h2>Notifications</h2>

          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((note, index) => (
              <div key={index} className="notification">
                <p>{note.message}</p>
                <span>{note.time}</span>
              </div>
            ))
          )}
        </div>

        {/* Sellers */}
        <div className="seller-section" ref={sellerRef}>
          <h2>Manage Sellers</h2>

          {sellers.length === 0 ? (
            <p>No sellers available</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {sellers.map((seller, index) => (
                  <tr key={index}>
                    <td>{seller.name}</td>
                    <td>{seller.email}</td>
                    <td className="role">{seller.role}</td>
                    <td className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditSeller(seller)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteSeller(seller.email)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ✅ USERS SECTION (NEW) */}
        <div className="seller-section" ref={usersRef}>
          <h2>Manage Users</h2>

          {normalUsers.length === 0 ? (
            <p>No users available</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>

              <tbody>
                {normalUsers.map((user, index) => (
                  <tr key={index}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td className="role">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="reports-section" ref={reportRef}>
  <h2>Reports</h2>

  <div className="report-cards">
    <div className="report-card">
      <h3>{totalUsers}</h3>
      <p>Registered Users</p>
    </div>

    <div className="report-card">
      <h3>{totalSellers}</h3>
      <p>Registered Sellers</p>
    </div>

    <div className="report-card">
      <h3>{totalAdmins}</h3>
      <p>Registered Admins</p>
    </div>

    <div className="report-card">
      <h3>{totalProducts}</h3>
      <p>Total Products</p>
    </div>
  </div>

  <div className="report-summary">
    <h3>Platform Summary</h3>
    <p>Total number of users registered in the system: <strong>{allUsers.length}</strong></p>
    <p>Normal users currently available: <strong>{totalUsers}</strong></p>
    <p>Sellers currently available: <strong>{totalSellers}</strong></p>
    <p>Admins currently available: <strong>{totalAdmins}</strong></p>
    <p>Total products listed on platform: <strong>{totalProducts}</strong></p>
  </div>
</div>

      </div>


          {showEditModal && (
  <div className="modal-overlay">
    <div className="edit-modal">
      <h2>Edit Seller</h2>

      <label>Name</label>
      <input
        type="text"
        value={editedName}
        onChange={(e) => setEditedName(e.target.value)}
      />

      <label>Email</label>
      <input type="text" value={selectedSeller?.email || ""} readOnly />

      <label>Role</label>
      <input type="text" value={selectedSeller?.role || ""} readOnly />

      <div className="modal-buttons">
        <button className="save-btn" onClick={handleSaveSeller}>
          Save
        </button>
        <button
          className="cancel-btn"
          onClick={() => setShowEditModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default AdminHome;
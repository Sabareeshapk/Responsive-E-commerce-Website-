import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Wishlist.css";

function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const storedWishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);

  const removeFromWishlist = (product) => {
    const updatedWishlist = wishlist.filter(
      (item) =>
        !(
          item.name === product.name &&
          item.sellerEmail === product.sellerEmail
        )
    );

    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1>My Wishlist ❤️</h1>
        <button onClick={() => navigate("/user")}>← Back to Home</button>
      </div>

      {wishlist.length === 0 ? (
        <p className="empty-wishlist">Your wishlist is empty</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item, index) => (
            <div className="wishlist-card" key={index}>
              <img
                src={item.image}
                alt={item.name}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x220?text=No+Image";
                }}
              />
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
              <p>{item.category}</p>

              <button
                className="remove-wishlist-btn"
                onClick={() => removeFromWishlist(item)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
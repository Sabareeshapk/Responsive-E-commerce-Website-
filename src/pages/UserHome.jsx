import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../Styles/User.css";

function UserHome() {
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser) {
    return <h2>Please login first</h2>;
  }

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [cart, setCart] = useState(
  JSON.parse(localStorage.getItem("cart")) || []
);
const [wishlist, setWishlist] = useState(
  JSON.parse(localStorage.getItem("wishlist")) || []
);

  const sliderImages = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b"
  ];

  // Slider auto change
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [sliderImages.length]);

  // Load products
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(storedProducts);
  }, []);


  const filteredProducts = products.filter((product) => {
  const matchesSearch = product.name
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesCategory =
    category === "All" || product.category === category;

  return matchesSearch && matchesCategory;
});


  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const getProductQuantity = (product) => {
  const item = cart.find(
    (cartItem) =>
      cartItem.name === product.name &&
      cartItem.sellerEmail === product.sellerEmail
  );
  return item ? item.quantity : 0;
};

const addToCart = (product) => {
  const existingItem = cart.find(
    (item) =>
      item.name === product.name &&
      item.sellerEmail === product.sellerEmail
  );

  let updatedCart;

  if (existingItem) {
    updatedCart = cart.map((item) =>
      item.name === product.name &&
      item.sellerEmail === product.sellerEmail
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    updatedCart = [...cart, { ...product, quantity: 1 }];
  }

  setCart(updatedCart);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
};

const increaseQuantity = (product) => {
  const updatedCart = cart.map((item) =>
    item.name === product.name &&
    item.sellerEmail === product.sellerEmail
      ? { ...item, quantity: item.quantity + 1 }
      : item
  );

  setCart(updatedCart);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
};

const decreaseQuantity = (product) => {
  const existingItem = cart.find(
    (item) =>
      item.name === product.name &&
      item.sellerEmail === product.sellerEmail
  );

  let updatedCart;

  if (existingItem.quantity === 1) {
    updatedCart = cart.filter(
      (item) =>
        !(
          item.name === product.name &&
          item.sellerEmail === product.sellerEmail
        )
    );
  } else {
    updatedCart = cart.map((item) =>
      item.name === product.name &&
      item.sellerEmail === product.sellerEmail
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
  }

  setCart(updatedCart);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
};

const isInWishlist = (product) => {
  return wishlist.some(
    (item) =>
      item.name === product.name &&
      item.sellerEmail === product.sellerEmail
  );
};

const toggleWishlist = (product) => {
  let updatedWishlist;

  if (isInWishlist(product)) {
    updatedWishlist = wishlist.filter(
      (item) =>
        !(
          item.name === product.name &&
          item.sellerEmail === product.sellerEmail
        )
    );
  } else {
    updatedWishlist = [...wishlist, product];
  }

  setWishlist(updatedWishlist);
  localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
};

  return (
    <div className="user-container">

      {/* Navbar */}
      <nav className="user-navbar">
        <h2 className="logo">ShopEasy</h2>

        <input
          type="text"
          placeholder="Search products..."
          className="search-bar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Fashion">Fashion</option>
          <option value="Electronics">Electronics</option>
          <option value="Footwear">Footwear</option>
          <option value="Accessories">Accessories</option>
          <option value="Home">Home</option>
        </select>

        <div className="profile-section">
          <button
            className="profile-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {loggedInUser?.name}
          </button>

          {showDropdown && (
            <div className="dropdown-menu">
              <button onClick={() => navigate("/user-profile")}>Profile</button>
              <button onClick={() => navigate("/cart")}>Cart</button>
              <button onClick={() => navigate("/wishlist")}>Wishlist</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      {/* Slider Section */}
      <div className="slider-container">
        <img
          src={sliderImages[currentSlide]}
          alt="banner"
          className="slider-image"
        />
      </div>

      {/* Products Section */}
      <div className="products-section">
        <h2>All Products</h2>

        {filteredProducts.length === 0 ? (
          <p className="no-products">No products available</p>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product, index) => (
              <div className="product-card" key={index}>
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x220?text=No+Image";
                  }}
                />
                <h3>{product.name}</h3>
                <p>₹{product.price}</p>
                <p>{product.category}</p>

                <p
                  className={
                    product.availability === "In Stock"
                      ? "stock in-stock"
                      : "stock out-stock"
                  }
                >
                  {product.availability}
                </p>

                <button
                  className={`wishlist-btn ${isInWishlist(product) ? "active" : ""}`}
                  onClick={() => toggleWishlist(product)}
                >
                  {isInWishlist(product) ? "❤️ Wishlisted" : "🤍 Add to Wishlist"}
                </button>

                {product.availability === "In Stock" ? (
                getProductQuantity(product) === 0 ? (
                  <button
                    className="add-cart-btn"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div className="quantity-box">
                    <button onClick={() => decreaseQuantity(product)}>-</button>
                    <span>{getProductQuantity(product)}</span>
                    <button onClick={() => increaseQuantity(product)}>+</button>
                  </div>
                )
              ) : (
                <button className="out-stock-btn" disabled>
                  Out of Stock
                </button>
              )}
              </div>
            ))}
          </div>
        )}
      </div>
          {/* Footer */}
<footer className="user-footer">
  <div className="footer-container">

    {/* Brand */}
    <div className="footer-section">
      <h2>ShopEasy</h2>
      <p>
        Your one-stop destination for fashion, electronics, footwear,
        accessories, and more. Shop smart, shop easy.
      </p>
    </div>

    {/* Quick Links */}
    <div className="footer-section">
      <h3>Quick Links</h3>
      <ul>
        <li>Home</li>
        <li>Profile</li>
        <li>Cart</li>
        <li>Wishlist</li>
      </ul>
    </div>

    {/* Categories */}
    <div className="footer-section">
      <h3>Categories</h3>
      <ul>
        <li>Fashion</li>
        <li>Electronics</li>
        <li>Footwear</li>
        <li>Accessories</li>
        <li>Home</li>
      </ul>
    </div>

    {/* Contact */}
    <div className="footer-section">
      <h3>Contact</h3>
      <p>Email: support@shopeasy.com</p>
      <p>Phone: +91 98765 43210</p>
      <p>Bangalore, India</p>
    </div>
  </div>

  <div className="footer-bottom">
    <p>© 2026 ShopEasy. All Rights Reserved.</p>
  </div>
</footer>
    </div>
  );
}

export default UserHome;
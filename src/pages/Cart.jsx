import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Cart.css";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Increase quantity
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

  // Decrease quantity
  const decreaseQuantity = (product) => {
    let updatedCart;

    const existingItem = cart.find(
      (item) =>
        item.name === product.name &&
        item.sellerEmail === product.sellerEmail
    );

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

  // Remove item
  const removeItem = (product) => {
    const updatedCart = cart.filter(
      (item) =>
        !(
          item.name === product.name &&
          item.sellerEmail === product.sellerEmail
        )
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Total price
  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>My Cart</h1>
        <button onClick={() => navigate("/user")}>← Back to Home</button>
      </div>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cart.map((item, index) => (
              <div className="cart-item" key={index}>
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x220?text=No+Image";
                  }}
                />

                <div className="cart-info">
                  <h3>{item.name}</h3>
                  <p>₹{item.price}</p>
                  <p>{item.category}</p>

                  <div className="quantity-box">
                    <button onClick={() => decreaseQuantity(item)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item)}>+</button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h2>Price Details</h2>
            <p>Total Items: <strong>{cart.length}</strong></p>
            <p>Total Price: <strong>₹{totalPrice}</strong></p>
            <button className="checkout-btn" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
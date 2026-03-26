import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};

  const [formData, setFormData] = useState({
    fullName: loggedInUser.name || "",
    phone: loggedInUser.phone || "",
    address: loggedInUser.address || "",
    city: loggedInUser.city || "",
    state: loggedInUser.state || "",
    pincode: loggedInUser.pincode || "",
    paymentMethod: "Cash on Delivery"
  });

  const [message, setMessage] = useState("");

  const totalAmount = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = () => {
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      setMessage("Please fill all delivery details");
      return;
    }

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const newOrder = {
      userEmail: loggedInUser.email,
      items: cart,
      totalAmount,
      deliveryDetails: formData,
      orderDate: new Date().toLocaleString(),
      status: "Order Placed"
    };

    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    localStorage.removeItem("cart");

    setMessage("Order placed successfully!");

    setTimeout(() => {
      navigate("/user");
    }, 1500);
  };

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <h1>Checkout </h1>

        {message && <p className="checkout-message">{message}</p>}

        {/* Delivery Form */}
        <div className="checkout-section">
          <h2>Delivery Details</h2>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
          />
        </div>

        {/* Payment */}
        <div className="checkout-section">
          <h2>Payment Method</h2>

          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>
        </div>

        {/* Order Summary */}
        <div className="checkout-section">
          <h2>Order Summary</h2>

          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <div className="checkout-products">
              {cart.map((item, index) => (
                <div className="checkout-product" key={index}>
                  <p>{item.name}</p>
                  <p>₹{item.price} × {item.quantity}</p>
                </div>
              ))}
            </div>
          )}

          <h3>Total: ₹{totalAmount}</h3>
        </div>

        <button className="place-order-btn" onClick={handlePlaceOrder}>
          Place Order
        </button>

        <button className="back-btn" onClick={() => navigate("/cart")}>
          ← Back to Cart
        </button>
      </div>
    </div>
  );
}

export default Checkout;
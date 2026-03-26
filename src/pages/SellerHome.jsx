import { useNavigate } from "react-router-dom";
import "../Styles/Seller.css";
import { useState, useEffect, useRef } from "react";

function SellerHome() {
  const navigate = useNavigate();

  // Sidebar toggle
  const [isOpen, setIsOpen] = useState(true);

  // Logged-in seller
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // Refs for scroll
  const addProductRef = useRef(null);
  const myProductsRef = useRef(null);

  // Scroll functions
  const scrollToAddProduct = () => {
    addProductRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToMyProducts = () => {
    myProductsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Product form
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    availability: "In Stock"
  });

  // Edit mode
  const [editIndex, setEditIndex] = useState(null);

  // Seller's products only
  const [products, setProducts] = useState([]);

  // Load only this seller's products
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];

    const sellerProducts = storedProducts.filter(
      (product) => product.sellerEmail === loggedInUser.email
    );

    setProducts(sellerProducts);
  }, [loggedInUser.email]);

  // Input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Add or Update product
  const handleAddProduct = () => {
    if (!formData.name || !formData.price || !formData.image || !formData.category) {
      return;
    }

    const allProducts = JSON.parse(localStorage.getItem("products")) || [];

    let updatedAllProducts = [...allProducts];

    if (editIndex !== null) {
      // Get this seller's products
      const sellerProducts = allProducts.filter(
        (product) => product.sellerEmail === loggedInUser.email
      );

      const productToEdit = sellerProducts[editIndex];

      updatedAllProducts = allProducts.map((product) =>
        product.name === productToEdit.name &&
        product.price === productToEdit.price &&
        product.image === productToEdit.image &&
        product.sellerEmail === productToEdit.sellerEmail
          ? {
              ...product,
              ...formData
            }
          : product
      );
    } else {
      // Add new product
      const newProduct = {
        ...formData,
        sellerName: loggedInUser.name,
        sellerEmail: loggedInUser.email
      };

      updatedAllProducts.push(newProduct);
    }

    // Save all products
    localStorage.setItem("products", JSON.stringify(updatedAllProducts));

    // Update only seller products in state
    const sellerProducts = updatedAllProducts.filter(
      (product) => product.sellerEmail === loggedInUser.email
    );

    setProducts(sellerProducts);

    // Reset form
    setFormData({
      name: "",
      price: "",
      image: "",
      category: "",
      availability: "In Stock"
    });

    setEditIndex(null);
  };

  // Edit product
  const handleEditProduct = (product, index) => {
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      availability: product.availability
    });

    setEditIndex(index);

    addProductRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Delete product
  const handleDeleteProduct = (indexToDelete) => {
    const allProducts = JSON.parse(localStorage.getItem("products")) || [];

    const sellerProducts = allProducts.filter(
      (product) => product.sellerEmail === loggedInUser.email
    );

    const productToDelete = sellerProducts[indexToDelete];

    const updatedAllProducts = allProducts.filter(
      (product) =>
        !(
          product.name === productToDelete.name &&
          product.price === productToDelete.price &&
          product.image === productToDelete.image &&
          product.sellerEmail === productToDelete.sellerEmail
        )
    );

    localStorage.setItem("products", JSON.stringify(updatedAllProducts));

    setProducts(
      updatedAllProducts.filter(
        (product) => product.sellerEmail === loggedInUser.email
      )
    );
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <div className="seller-container">
      {/* Sidebar */}
      <div className={`seller-sidebar ${isOpen ? "open" : "closed"}`}>
        <h2>Seller</h2>
        <button>Dashboard</button>
        <button onClick={() => navigate("/seller-profile")}>Profile</button>
        <button onClick={scrollToAddProduct}>Add Product</button>
        <button onClick={scrollToMyProducts}>My Products</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Main Content */}
      <div className="seller-main">
        <div className="seller-topbar">
          <h1>Seller Dashboard</h1>

          <button className="seller-menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Cards */}
        <div className="seller-cards">
          <div className="seller-card">
            <h2>{products.length}</h2>
            <p>Total Products</p>
          </div>

          <div className="seller-card">
            <h2>{loggedInUser.name}</h2>
            <p>Seller Name</p>
          </div>

          <div className="seller-card">
            <h2>{loggedInUser.email}</h2>
            <p>Seller Email</p>
          </div>
        </div>

        {/* Add Product */}
        <div className="add-product-section" ref={addProductRef}>
          <h2>{editIndex !== null ? "Edit Product" : "Add Product"}</h2>

          <div className="product-form">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="text"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
            />

            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleChange}
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="Fashion">Fashion</option>
              <option value="Electronics">Electronics</option>
              <option value="Footwear">Footwear</option>
              <option value="Accessories">Accessories</option>
              <option value="Home">Home</option>
            </select>

            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

            <button onClick={handleAddProduct}>
              {editIndex !== null ? "Update Product" : "Add Product"}
            </button>
          </div>
        </div>

        {/* My Products */}
        <div className="my-products-section" ref={myProductsRef}>
          <h2>My Products</h2>

          {products.length === 0 ? (
            <p>No products added yet</p>
          ) : (
            <div className="product-grid">
              {products.map((product, index) => (
                <div className="product-box" key={index}>
                  <img src={product.image} alt={product.name} />
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

                  <div className="product-actions">
                    <button
                      className="edit-product-btn"
                      onClick={() => handleEditProduct(product, index)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-product-btn"
                      onClick={() => handleDeleteProduct(index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SellerHome;
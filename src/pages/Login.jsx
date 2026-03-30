import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../Auth.css";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (loggedInUser) {
    if (loggedInUser.role === "admin") {
      navigate("/admin");
    } else if (loggedInUser.role === "seller") {
      navigate("/seller");
    } else if (loggedInUser.role === "user") {
      navigate("/user");
    }
  }
}, [navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: ""
  });

  // Validation function
  const validateField = (name, value) => {
    let error = "";

    if (name === "email") {
      if (!value.endsWith("@gmail.com")) {
        error = "Email must end with @gmail.com";
      }
    }

    if (name === "password") {
      let passwordErrors = [];

      if (value.length < 8) {
        passwordErrors.push("Password must be at least 8 characters");
      }

      if (!/[A-Z]/.test(value)) {
        passwordErrors.push("Password must contain at least 1 uppercase letter");
      }

      if (!/[!@#$%^&*(),.?\":{}|<>]/.test(value)) {
        passwordErrors.push("Password must contain at least 1 special character");
      }

      error = passwordErrors.join(", ");
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    setErrors({
      ...errors,
      [name]: validateField(name, value),
      general: ""
    });
  };

  const handleLogin = () => {
    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      general: ""
    };

    setErrors(newErrors);

    if (
      !formData.email ||
      !formData.password ||
      newErrors.email ||
      newErrors.password
    ) {
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const validUser = users.find(
      (user) =>
        user.email === formData.email &&
        user.password === formData.password
    );

    if (!validUser) {
      setErrors({
        ...newErrors,
        general: "Invalid email or password"
      });
      return;
    }

    // Save logged-in user
    localStorage.setItem("loggedInUser", JSON.stringify(validUser));

    // Role-based navigation
    if (validUser.role === "admin") {
      navigate("/admin");
    } else if (validUser.role === "seller") {
      navigate("/seller");
    } else if (validUser.role === "user") {
      navigate("/user");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}

        {/* General Login Error */}
        {errors.general && <p className="error-text">{errors.general}</p>}

        <button onClick={handleLogin}>Login</button>

        <p className="forgot-link">
            <Link to="/forgot-password">Forgot Password?</Link>
      </p>

        <p>
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../Auth.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Register() {
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
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user"
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation function
  const validateField = (name, value, allData = formData) => {
    let error = "";

    if (name === "name") {
      if (!/^[A-Za-z]/.test(value)) {
        error = "Name must start with alphabets";
      }
    }

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

    if (name === "confirmPassword") {
      if (value !== allData.password) {
        error = "Passwords do not match";
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value
    };

    setFormData(updatedFormData);

    setErrors({
      ...errors,
      [name]: validateField(name, value, updatedFormData),
      confirmPassword:
        name === "password" || name === "confirmPassword"
          ? validateField(
              "confirmPassword",
              name === "confirmPassword" ? value : updatedFormData.confirmPassword,
              updatedFormData
            )
          : errors.confirmPassword,
      general: ""
    });
  };

  const handleRegister = () => {
    // Validate all fields again before submit
    const newErrors = {
      name: validateField("name", formData.name, formData),
      email: validateField("email", formData.email, formData),
      password: validateField("password", formData.password, formData),
      confirmPassword: validateField(
        "confirmPassword",
        formData.confirmPassword,
        formData
      ),
      general: ""
    };

    setErrors(newErrors);

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      newErrors.name ||
      newErrors.email ||
      newErrors.password ||
      newErrors.confirmPassword
    ) {
      setErrors({
        ...newErrors,
        general: "Please fix the errors before registering"
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.find(
      (user) => user.email === formData.email
    );

    if (userExists) {
      setErrors({
        ...newErrors,
        general: "User already exists!"
      });
      return;
    }

    // Remove confirmPassword before saving
    const { confirmPassword, ...userToSave } = formData;

    users.push(userToSave);
    localStorage.setItem("users", JSON.stringify(users));

    // Seller notification for admin
    if (formData.role === "seller") {
      const notifications =
        JSON.parse(localStorage.getItem("notifications")) || [];

      notifications.push({
        message: `${formData.name} registered as Seller`,
        time: new Date().toLocaleString()
      });

      localStorage.setItem("notifications", JSON.stringify(notifications));
    }

    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error-text">{errors.name}</p>}

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
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
</div>
        {errors.password && <p className="error-text">{errors.password}</p>}

        {/* Confirm Password */}
        <div className="password-field">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <span
            className="toggle-password"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
</div>
        {errors.confirmPassword && (
          <p className="error-text">{errors.confirmPassword}</p>
        )}

        {/* Role Selection */}
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={handleRegister}>Register</button>

        {/* General Error Below Button */}
        {errors.general && <p className="error-text">{errors.general}</p>}

        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
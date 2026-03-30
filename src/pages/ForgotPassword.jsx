import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../Auth.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function ForgotPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
    general: "",
    success: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateField = (name, value, allData = formData) => {
    let error = "";

    if (name === "email") {
      if (!value.endsWith("@gmail.com")) {
        error = "Email must end with @gmail.com";
      }
    }

    if (name === "newPassword") {
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
      if (value !== allData.newPassword) {
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
        name === "newPassword" || name === "confirmPassword"
          ? validateField(
              "confirmPassword",
              name === "confirmPassword" ? value : updatedFormData.confirmPassword,
              updatedFormData
            )
          : errors.confirmPassword,
      general: "",
      success: ""
    });
  };

  const handleResetPassword = () => {
    const newErrors = {
      email: validateField("email", formData.email, formData),
      newPassword: validateField("newPassword", formData.newPassword, formData),
      confirmPassword: validateField(
        "confirmPassword",
        formData.confirmPassword,
        formData
      ),
      general: "",
      success: ""
    };

    setErrors(newErrors);

    if (
      !formData.email ||
      !formData.newPassword ||
      !formData.confirmPassword ||
      newErrors.email ||
      newErrors.newPassword ||
      newErrors.confirmPassword
    ) {
      setErrors({
        ...newErrors,
        general: "Please fix the errors before resetting password"
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userIndex = users.findIndex((user) => user.email === formData.email);

    if (userIndex === -1) {
      setErrors({
        ...newErrors,
        general: "No account found with this email"
      });
      return;
    }

    // Update password
    users[userIndex].password = formData.newPassword;
    localStorage.setItem("users", JSON.stringify(users));

    // Update logged in user if same
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser && loggedInUser.email === formData.email) {
      loggedInUser.password = formData.newPassword;
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    }

    setErrors({
      email: "",
      newPassword: "",
      confirmPassword: "",
      general: "",
      success: "Password reset successfully! Redirecting to login..."
    });

    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Reset Password</h2>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        {/* New Password */}
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        </div>
        {errors.newPassword && <p className="error-text">{errors.newPassword}</p>}

        {/* Confirm Password */}
        <div className="password-field">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <span
            className="toggle-password"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <FontAwesomeIcon
              icon={showConfirmPassword ? faEyeSlash : faEye}
            />
          </span>
        </div>
        {errors.confirmPassword && (
          <p className="error-text">{errors.confirmPassword}</p>
        )}

        <button onClick={handleResetPassword}>Reset Password</button>

        {errors.general && <p className="error-text">{errors.general}</p>}
        {errors.success && <p className="success-text">{errors.success}</p>}

        <p>
          Back to <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
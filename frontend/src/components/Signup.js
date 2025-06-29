import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import './Signup.css';

const Signup = () => {
  const { register, setUser } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" // default role
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const registeredUser = await register(userData);

      if (!registeredUser || !registeredUser.role) {
        setError("Registration failed. Please try again.");
        return;
      }

      // Save user context and token if available
      if (registeredUser.token) {
        setUser(registeredUser);
        localStorage.setItem("user", JSON.stringify(registeredUser));
      }

      // Navigate based on role
      if (registeredUser.role === "admin") {
        navigate("/admin-dashboard");
      } else if (registeredUser.role === "user") {
        navigate("/user-dashboard");
      } else if (registeredUser.role === "professional") {
        navigate("/professional-dashboard");
      } else {
        navigate("/dashboard"); // fallback
      }

    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <h2>Create an Account</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;

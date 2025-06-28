import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { professionalsList } from "../data/professionals"; // Your professional users
import "./Login.css";

const PROFESSIONAL_PASSWORD = "pro123"; // Password for professionals

const Login = () => {
  const { login, setUser } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Find professional in the list by email (case-insensitive)
    const matchedProfessional = professionalsList.find(
      (pro) => pro.email.toLowerCase() === credentials.email.toLowerCase()
    );

    if (matchedProfessional) {
      // Professional found, verify the password
      if (credentials.password === PROFESSIONAL_PASSWORD) {
        // Set user context and navigate to professional dashboard
        setUser({
          email: matchedProfessional.email,
          role: "professional",
          name: matchedProfessional.name,
        });
        navigate("/professional-dashboard");
      } else {
        setError("Incorrect password for professional login.");
      }
      return; // Stop here if professional login attempt
    }

    // Normal user/admin login flow
    try {
      const userData = await login(credentials);

      if (!userData || !userData.role) {
        setError("Login failed. Please check your credentials.");
        return;
      }

      // Redirect based on user role
      if (userData.role === "admin") {
        navigate("/admin-dashboard");
      } else if (userData.role === "user") {
        navigate("/user-dashboard");
      } else {
        setError("Unrecognized user role.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>User Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={credentials.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { professionalsList } from "../data/professionals";
import "./Login.css";

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

    // Check if it's a professional
    const matchedProfessional = professionalsList.find(
      (pro) => pro.email.toLowerCase() === credentials.email.toLowerCase()
    );

    if (matchedProfessional) {
      // Professional login via backend
      try {
        const response = await fetch("http://localhost:5000/api/auth/professional-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Professional login failed");
        }

        const professionalUser = {
          token: data.token,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        };

        localStorage.setItem("user", JSON.stringify(professionalUser));
        localStorage.setItem("token", data.token);
        setUser(professionalUser);
        navigate("/professional-dashboard");
        return;
      } catch (error) {
        console.error("Professional login error:", error);
        setError("Professional login failed. Please try again.");
        return;
      }
    }

    // Fallback to user/admin login
    try {
      const userData = await login(credentials);
      if (!userData || !userData.role) {
        setError("Login failed. Please check your credentials.");
        return;
      }

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
      <h2>Login here</h2>
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

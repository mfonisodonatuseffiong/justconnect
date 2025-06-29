import React, { useState } from "react";
import "./Login.css";

const ProfessionalLogin = () => {
  const [professionalData, setProfessionalData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setProfessionalData({
      ...professionalData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/professional-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(professionalData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend Error Response:", errorText);
        throw new Error("Login failed: " + errorText);
      }

      const result = await response.json();
      console.log("Professional Login Response:", result);

      if (!result.token || result.user?.role !== "professional") {
        throw new Error("Invalid server response: Missing token or incorrect role.");
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.user.role);
      localStorage.setItem("name", result.user.name);

      alert("Login successful!");
      window.location.href = "/professional-dashboard";
    } catch (error) {
      console.error("Login Error:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Professional Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={professionalData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={professionalData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default ProfessionalLogin;

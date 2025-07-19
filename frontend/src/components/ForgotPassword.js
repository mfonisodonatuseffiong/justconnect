import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSent(false);

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      setSent(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-container">
        <h2>Forgot Your Password?</h2>
        <p className="subtext">
          Enter your email and we’ll send you a reset link.
        </p>

        {sent ? (
          <p className="success-message">📧 Check your inbox for instructions!</p>
        ) : (
          <>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="forgot-form">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. user@example.com"
                required
              />
              <button type="submit">Send Reset Link</button>
            </form>
          </>
        )}
        <p className="back-to-login">
          <Link to="/login">← Back to login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { professionalsList } from "../data/professionals";
import "./Login.css";

const Login = () => {
  const { login, setUser } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const matchedProfessional = professionalsList.find(
      (pro) => pro.email.toLowerCase() === credentials.email.toLowerCase()
    );

    if (matchedProfessional) {
      try {
        const response = await fetch("http://localhost:5000/api/auth/professional-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Login failed");

        const professionalUser = {
          token: data.token,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        };

        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(professionalUser));
          localStorage.setItem("token", data.token);
        }

        setUser(professionalUser);
        navigate("/professional-dashboard");
        return;
      } catch {
        setError("Professional login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const userData = await login(credentials);
        if (!userData || !userData.role) {
          setError("Login failed. Please check your credentials.");
          return;
        }

        const routeMap = {
          admin: "/admin-dashboard",
          user: "/user-dashboard",
        };

        if (routeMap[userData.role]) {
          navigate(routeMap[userData.role]);
        } else {
          setError("Unrecognized user role.");
        }
      } catch {
        setError("Login failed. Incorrect User/Password");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <ul className="bubble-background">
        <li></li><li></li><li></li><li></li><li></li>
      </ul>

      <div className="login-container">
        <h2>Welcome Back</h2>
        <p className="subtext">Log in to your account</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form" autoComplete="on">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            placeholder="e.g. user@example.com"
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />

          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className={loading ? "loading" : ""}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="create-account-text">
            Don’t have an account? <Link to="/signup" className="signup-link">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

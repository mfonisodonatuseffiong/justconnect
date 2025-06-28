import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = async (userData) => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/register", userData);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      console.error("Registration failed:", message);
      throw new Error(message);
    }
  };

  const login = async (credentials) => {
    try {
      // Use normal login API (for users/admins)
      const { data } = await axios.post("http://localhost:5000/api/auth/login", credentials);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("role", data.role);
      setUser(data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      console.error("Login failed:", message);
      throw new Error(message);
    }
  };

  // Optional helper for manual professional login without backend call
  const manualProfessionalLogin = (professional, password) => {
    const PROFESSIONAL_PASSWORD = "pro123";

    if (password === PROFESSIONAL_PASSWORD) {
      const proUser = {
        email: professional.email,
        name: professional.name,
        role: "professional",
      };
      setUser(proUser);
      localStorage.setItem("user", JSON.stringify(proUser));
      localStorage.setItem("role", "professional");
      return proUser;
    } else {
      throw new Error("Incorrect professional password");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,                // <-- added setUser here so you can use it outside
        register,
        login,
        logout,
        manualProfessionalLogin // <-- optionally expose manual login helper
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

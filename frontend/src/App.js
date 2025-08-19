import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Introduction from "./components/Introduction";
import Features from "./components/Features";
import About from "./components/About";
import Testimonials from "./components/Testimonials";
import Statistics from "./components/Statistics";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";

import Plumbers from "./components/Plumbers";
import ProfessionalDashboard from "./components/ProfessionalDashboard";
import UserDashboard from "./components/UserDashboard";
import ChatRoom from "./components/ChatRoom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProfessionalLogin from "./components/ProfessionalLogin";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";


// 🔁 Scroll to anchor (e.g. #services) if hash is in URL
const ScrollToHashElement = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 0);
      }
    }
  }, [location]);

  return null;
};

// 🔁 Redirect logged-in users to dashboard, except when visiting specific public routes or anchors
const RedirectAuthenticatedUser = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (location.pathname === "/" && location.hash) return;

    if (location.pathname === "/") {
      if (role === "professional") {
        navigate("/professional-dashboard");
      } else if (role === "user") {
        navigate("/user-dashboard");
      }
    }
  }, [navigate, location]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToHashElement />
        <RedirectAuthenticatedUser />
        <div className="App">
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <Introduction />
                  <Features />
                  <About />
                  <Testimonials />
                  <Statistics />
                  <FAQ />
                  <Contact />
                  <Footer />
                  <BackToTop />
                </>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/professional-login" element={<ProfessionalLogin />} />
            <Route path="/plumbers" element={<Plumbers />} />
            <Route
              path="/professional-dashboard"
              element={
               
                  <ProfessionalDashboard />
                
              }
            />
            <Route
              path="/user-dashboard"
              element={
                <PrivateRoute>
                  <UserDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/chat/:roomId"
              element={
                <PrivateRoute>
                  <ChatRoom />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

// src/App.jsx
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./components/layout/Navbar";
import FooterBar from "./components/layout/FooterBar";
import AppLoader from "./components/commonUI/AppLoader";
import ScrollToTop from "./components/commonUI/ScrollTop";
import { useAuthStore } from "./store/authStore";

// User Dashboard
import DashboardLayout from "./dashboards/User/DashboardLayout";
import Home from "./dashboards/User/Home";
import BookingsPage from "./dashboards/User/BookingsPage";
import MessagesPage from "./dashboards/User/MessagesPage";
import ProfilePage from "./dashboards/User/ProfilePage";
import SettingsPage from "./dashboards/User/SettingsPage";

// Booking flow
import BrowseProfessionals from "./dashboards/User/BrowseProfessionals.jsx";
import BookProfessional from "./dashboards/User/BookProfessional";
import BookingConfirmation from "./dashboards/User/BookingConfirmation";

// Public
import LandingPage from "./pages/LandingPage";

// Other routes (auth, 404)
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  const { auth, isCheckingMe } = useAuthStore();
  const location = useLocation();

  const hiddenRoutes = [
    "/auth/login",
    "/auth/signup",
    "/auth/forget-password",
    "/auth/reset-password",
    "/professional-dashboard",
    "/user-dashboard",
    "/page-not-found",
  ];

  const shouldHideNav = hiddenRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      (async () => {
        try {
          await auth.checkMe();
        } catch (err) {
          console.error("App init checkMe error:", err);
        }
      })();
    }
  }, [auth]);

  useEffect(() => {
    AOS.init({
      offset: 50,
      duration: 1000,
      once: false,
      easing: "ease-in-out",
    });
  }, []);

  if (isCheckingMe) return <AppLoader />;

  return (
    <div className="min-h-screen overflow-hidden">
      {!shouldHideNav && <Navbar />}
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />

        <Route path="/user-dashboard" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="bookings/new" element={<BrowseProfessionals />} />
          <Route path="bookings/new/:id" element={<BookProfessional />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/*" element={<AppRoutes />} />
      </Routes>

      {!shouldHideNav && <FooterBar />}
    </div>
  );
};

export default App;
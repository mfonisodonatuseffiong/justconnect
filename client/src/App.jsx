/**
 * @description - This is the main entry of our frontend application
 *    - import the appRoute from the routes folder to access tha routes
 * @returns appRoutes to all pages accessible in the react app
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/layout/Navbar";
import FooterBar from "./components/layout/FooterBar";
import { AppRoutes } from "./routes/AppRoutes";
import ScrollToTop from "./components/commonUI/ScrollTop";

const App = () => {
  // to hide navbar and footer on authRoutes
  const authRoutes = [
    "/auth/login",
    "/auth/signup",
    "/auth/forget-password",
    "/page-not-found",
  ];
  const location = useLocation();
  const isAuthRoute = authRoutes.includes(location.pathname);

  // animate on scroll
  useEffect(() => {
    AOS.init({
      offset: 50,
      duration: 1000,
      once: false,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      {!isAuthRoute && <Navbar />}
      <ScrollToTop />
      <AppRoutes />
      {!isAuthRoute && <FooterBar />}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default App;

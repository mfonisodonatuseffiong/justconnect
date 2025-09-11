/**
 * @description - This is the main entry of our frontend application
 *    - import the appRoute from the routes folder to access tha routes
 * @returns appRoutes to all pages accessible in the react app
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./components/layout/Navbar";
import FooterBar from "./components/layout/FooterBar";
import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";


const App = () => {
  // to hide navbar and footer on authRoutes
  const authRoutes = ["/auth/login", "/auth/signup", "/auth/forget-password"];
  const location = useLocation();
  const isAuthRoute = authRoutes.includes(location.pathname);

  // animate on scroll
  useEffect(() => {
    AOS.init({
      offset: 120,
      duration: 1000,
      once: false,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div className="min-h-screen">
      {!isAuthRoute && <Navbar />}
      <AppRoutes />
      {!isAuthRoute && <FooterBar />}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default App;

/**
 * @description - This is the main entry of our frontend application
 *    - import the appRoute from the routes folder to access tha routes
 * @returns appRoutes to all pages accessble in the react app
 */

import { AppRoutes } from "./routes/AppRoutes";
import { useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./components/layout/Navbar";
import FooterBar from "./components/layout/FooterBar";
import { useEffect } from "react";

const App = () => {
  const authRoutes = ["/auth/login", "/auth/signup", "/auth/forget-password"];
  const location = useLocation();
  const isAuthRoute = authRoutes.includes(location.pathname);

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
    </div>
  );
};

export default App;

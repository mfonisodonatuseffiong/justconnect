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
import AppLoader from "./components/commonUI/AppLoader";
import { AppRoutes } from "./routes/AppRoutes";
import ScrollToTop from "./components/commonUI/ScrollTop";
import { useAuthHook } from "./hooks/authHooks";
import { useAuthStore } from "./store/authStore";

const App = () => {
  const { checkMeHook } = useAuthHook();
  const { isCheckingMe } = useAuthStore();
  const location = useLocation();

  // to hide navbar and footer on authRoutes
  const hiddenRoutes = [
    "/auth/login",
    "/auth/signup",
    "/auth/forget-password",
    "/auth/reset-password",
    "/dashboard",
    "/page-not-found",
  ];

  const shouldHideNav = hiddenRoutes.some((path) =>
    location.pathname.startsWith(path),
  );

  // check current user
  useEffect(() => {
    checkMeHook();
  }, [checkMeHook]);

  // animate on scroll
  useEffect(() => {
    AOS.init({
      offset: 50,
      duration: 1000,
      once: false,
      easing: "ease-in-out",
    });
  }, []);

  // loader while checking current user
  if (isCheckingMe) return <AppLoader />;

  return (
    <div className="min-h-screen overflow-hidden">
      {!shouldHideNav && <Navbar />}
      <ScrollToTop />
      <AppRoutes /> {/** where all app routes are defined */}
      {!shouldHideNav && <FooterBar />}
      <Toaster />
    </div>
  );
};

export default App;

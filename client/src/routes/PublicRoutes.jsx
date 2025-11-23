/**
 * @description This is the routes definition for all public routes
 *              This routes needs to authentication to be visited and authenticated users can visit too
 * @returns Homepage route known as the Redirect route
 *          Contact us, FAqs, Services e.t.c
 */

import { lazy } from "react";
import { Route } from "react-router-dom";

import PrivacyPolicy from "../pages/Privacy";
import TermsOfService from "../pages/TermsOfServices";
const HomePage = lazy(() => import("../pages/HomePage"));
const FaqPage = lazy(() => import("../pages/FaqPage"));
const ServicesPage = lazy(() => import("../pages/Service"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const NotFoundPage = lazy(() => import("../pages/Page404"));
const ContactPage = lazy(() => import("../pages/ContactUsPage"));
const UnauthorizedPage = lazy(() => import("../pages/UnauthorizedPage"));

const PublicRoutes = (
  <>
    <Route path="/" element={<HomePage />} />
    <Route path="/faqs" element={<FaqPage />} />
    <Route path="/about-us" element={<AboutPage />} />
    <Route path="/explore-services" element={<ServicesPage />} />
    <Route path="/contact-us" element={<ContactPage />} />
    <Route path="/privacy" element={<PrivacyPolicy />} />
    <Route path="/terms" element={<TermsOfService />} />
    <Route path="/unauthorized-access" element={<UnauthorizedPage />} />
    <Route path="/*" element={<NotFoundPage />} />
  </>
);

export default PublicRoutes;

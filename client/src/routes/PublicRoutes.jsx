/**
 * @description This is the routes definition for all public routes
 *              This routes needs to authentication to be visited and authenticated users can visit too
 * @returns Homepage route known as the Redirect route
 *          Contact us, FAqs, Services e.t.c
 */

import { lazy } from "react";
import { Route } from "react-router-dom";

import RedirectPage from "./Redirect";

const FaqPage = lazy(() => import("../pages/FaqPage"));
const ServicesPage = lazy(() => import("../pages/Service"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const NotFoundPage = lazy(() => import("../pages/Page404"));
const ContactPage = lazy(() => import("../pages/ContactUsPage"));
const UnauthorizedPage = lazy(() => import("../pages/UnauthorizedPage"));

const PublicRoutes = (
  <>
    <Route path="/" element={<RedirectPage />} />
    <Route path="/faqs" element={<FaqPage />} />
    <Route path="/about-us" element={<AboutPage />} />
    <Route path="/services" element={<ServicesPage />} />
    <Route path="/contact-us" element={<ContactPage />} />
    <Route path="/unauthorized-access" element={<UnauthorizedPage />} />
    <Route path="/page-not-found" element={<NotFoundPage />} />
  </>
);

export default PublicRoutes;

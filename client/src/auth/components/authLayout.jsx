/**
 * @description - This is the layout component for the authentication pages
 *               - Left side takes the form field as children while the right side takes the illustration
 * @returns Auth layout with background and container
 */


import {Link } from "react-router-dom";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen grid md:grid-cols-2 p-4 bg-gradient">
      {/** left side for form */}
      <div className="relative flex items-center justify-center overflow-hidden pt-16">
        {/** -------------- logo --------------- */}
        <div className="logo-container absolute top-5 left-0 md:left-5">
          {" "}
          <Link to="/" aria-label="App logo, clicks and takes you home">
            <h2 className="text-xl font-regular md:text-2xl uppercase hover:-translate-y-1.5 transition-all duration-500">
              <span className="text-[#ff6f61]">J</span>ustConnect
            </h2>
          </Link>
        </div>
        {/** ------------------- background effect -------------- */}
        <div className="absolute before:bg-purple-600 bottom-10 -left-10 h-56 w-56 rotate-50 bg-purple-200 opacity-30 rounded-4xl"></div>
        <div className="absolute before:bg-purple-600 top-0 -right-5 h-56 w-56 rotate-50 bg-purple-400 opacity-30 rounded-4xl"></div>
        {children}
      </div>
      {/** right side for illustration */}
      <div className="hidden md:flex"> image Illustration</div>
    </div>
  );
};

export default AuthLayout;

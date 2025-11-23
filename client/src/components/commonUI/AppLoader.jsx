/**
 * @description Full-page branded loader.
 * Displays logo and a simple text indicator while the app is initializing or checking authentication.
 */

const AppLoader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center bg-brand-bg justify-center backdrop-blur-3xl z-50">
      {/* Logo */}
      <img
        src="/logo-white-bg.png"
        alt="App logo"
        className="h-auto w-36 md:w-58 mb-4 animate-pulse drop-shadow-2xl"
      />

      {/* Loading text */}
      <p className="text-sm text-primary-gray font-medium tracking-wide animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default AppLoader;

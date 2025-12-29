// src/dashboards/User/SettingsPage.jsx

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white border border-orange-200 rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">
          Settings
        </h2>

        <p className="text-slate-500 mb-6">
          Manage your account preferences and application settings.
        </p>

        {/* Placeholder sections */}
        <div className="space-y-4">
          <div className="p-4 border border-slate-200 rounded-xl">
            <h3 className="font-semibold text-slate-700">
              Account Settings
            </h3>
            <p className="text-sm text-slate-500">
              Update your personal information and login details.
            </p>
          </div>

          <div className="p-4 border border-slate-200 rounded-xl">
            <h3 className="font-semibold text-slate-700">
              Notifications
            </h3>
            <p className="text-sm text-slate-500">
              Control how you receive alerts and messages.
            </p>
          </div>

          <div className="p-4 border border-slate-200 rounded-xl">
            <h3 className="font-semibold text-slate-700">
              Privacy & Security
            </h3>
            <p className="text-sm text-slate-500">
              Manage your security preferences and data visibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

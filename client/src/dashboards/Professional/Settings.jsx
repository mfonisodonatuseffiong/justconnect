/**
 * @description Professional dashboard settings page
 *              - Allows professionals to manage account and preferences
 *              - Styled with orange, rose, and amber brand colors
 */

import { Card, CardContent, CardHeader, CardTitle } from "./components/card";
import Button from "./components/Button";

const Settings = () => {
  return (
    <div className="md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-orange-600">Settings</h1>
        <p className="text-rose-600">
          Manage your account preferences and dashboard options.
        </p>
      </div>

      {/* Account Settings */}
      <Card className="rounded-2xl shadow-sm border border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-700">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-700">Change Password</span>
            <Button
              variant="outline"
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              Update
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-700">Update Email</span>
            <Button
              variant="outline"
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="rounded-2xl shadow-sm border border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-700">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-700">Notifications</span>
            <Button className="bg-orange-600 text-white hover:bg-orange-700">
              Configure
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-700">Theme</span>
            <Button className="bg-orange-600 text-white hover:bg-orange-700">
              Change
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;

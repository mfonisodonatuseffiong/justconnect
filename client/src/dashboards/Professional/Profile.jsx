/**
 * @returns A profile component for professionals dashboard
 */

const Profile = () => {
  return (
    <div className="min-h-screen w-full flex items-start bg-rose-50">
      <div className="rounded-2xl shadow-lg p-6 space-y-8 bg-white border border-amber-200 w-full max-w-3xl mx-auto">
        <h1 className="text-lg md:text-2xl font-bold text-orange-600">My Profile</h1>

        {/* Top Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src="https://randomuser.me/api/portraits/men/75.jpg"
            alt="profile picture"
            className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-orange-500"
          />

          <div className="space-y-2 w-full">
            <p className="text-xl font-semibold text-amber-700">Donatus</p>
            <p className="text-rose-600 text-sm">Plumber</p>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-orange-50 p-3 rounded-xl border border-orange-200">
                <p className="text-xs text-rose-600">Email</p>
                <p className="font-medium text-amber-700">donatus@example.com</p>
              </div>

              <div className="bg-orange-50 p-3 rounded-xl border border-orange-200">
                <p className="text-xs text-rose-600">Phone</p>
                <p className="font-medium text-amber-700">+234 810 000 0000</p>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-orange-600">About Me</h2>
          <p className="text-rose-600 text-sm leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta odit
            voluptatum eligendi dolorem laboriosam saepe aliquam laudantium eos
            nemo quibusdam sed, et aliquid rem non dolorum autem ea?
            Reprehenderit, explicabo?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;

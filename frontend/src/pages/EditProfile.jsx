import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { API_BASE_URL } from "../api/axios";

function EditProfile({ user, onUpdate }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profilePic: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        profilePic: user.profilePic || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await API.put(`${API_BASE_URL}/users/profile`, formData);
      onUpdate(data);
      navigate(`/profile/${user._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[65vh] animate-fade-in-up">
      <div className="glass-card rounded-3xl p-8 w-full max-w-md relative overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-400/20 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-800 text-center mb-1">Edit Profile</h2>
          <p className="text-gray-400 text-center mb-7 text-sm">Update your personal information</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your name (min 3 characters)"
                minLength={3}
                value={formData.name}
                onChange={handleChange}
                required
                className="input-modern"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="input-modern !bg-gray-50/80 !text-gray-400 !cursor-not-allowed !border-gray-200"
              />
              <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                Email cannot be changed
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bio</label>
              <textarea
                name="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="input-modern resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Profile Picture URL</label>
              <input
                type="text"
                name="profilePic"
                placeholder="https://example.com/photo.jpg"
                value={formData.profilePic}
                onChange={handleChange}
                className="input-modern"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50/80 backdrop-blur p-3 rounded-xl border border-red-100 animate-slide-down">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-gradient py-3 rounded-xl font-semibold text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="loading-spinner" style={{width: '18px', height: '18px', borderWidth: '2px', borderTopColor: 'white'}} />
                    Saving...
                  </span>
                ) : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/profile/${user._id}`)}
                className="flex-1 bg-white/60 backdrop-blur text-gray-600 py-3 rounded-xl font-semibold text-sm border border-gray-200/80 hover:bg-white/80 hover:border-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;


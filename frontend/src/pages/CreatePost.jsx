import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { API_BASE_URL } from "../api/axios";

function CreatePost() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ text: "", image: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post(`${API_BASE_URL}/posts`, formData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[65vh] animate-fade-in-up">
      <div className="glass-card rounded-3xl p-8 w-full max-w-lg relative overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-indigo-400/20 to-cyan-400/20 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-800 text-center mb-1">Create Post</h2>
          <p className="text-gray-400 text-center mb-7 text-sm">Share your thoughts with the world</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                What's on your mind? *
              </label>
              <textarea
                name="text"
                placeholder="Write something amazing..."
                value={formData.text}
                onChange={handleChange}
                required
                rows={5}
                className="input-modern resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Image URL (optional)
              </label>
              <input
                type="text"
                name="image"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={handleChange}
                className="input-modern"
              />
            </div>

            {/* Image Preview */}
            {formData.image && (
              <div className="rounded-2xl overflow-hidden border border-white/50 shadow-sm animate-fade-in">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full max-h-64 object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}

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
                    Publishing...
                  </span>
                ) : "Publish Post"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
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

export default CreatePost;

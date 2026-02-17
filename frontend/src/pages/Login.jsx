import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API, { API_BASE_URL } from "../api/axios";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      const { data } = await API.post(`${API_BASE_URL}/auth/login`, formData);
      onLogin(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh] animate-fade-in-up">
      <div className="glass-card rounded-3xl p-8 w-full max-w-md relative overflow-hidden">
        {/* Decorative gradient orb */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-3xl pointer-events-none" />
        
        <div className="relative">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-800 text-center mb-1">Welcome Back</h2>
          <p className="text-gray-400 text-center mb-7 text-sm">Sign in to continue to MiniSocial</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-modern"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Minimum 6 characters"
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                required
                className="input-modern"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50/80 backdrop-blur p-3 rounded-xl border border-red-100 animate-slide-down">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient py-3 rounded-xl font-semibold text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading-spinner" style={{width: '18px', height: '18px', borderWidth: '2px', borderTopColor: 'white'}} />
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-7">
            Don't have an account?{" "}
            <Link to="/register" className="gradient-text font-semibold hover:opacity-80 transition">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;


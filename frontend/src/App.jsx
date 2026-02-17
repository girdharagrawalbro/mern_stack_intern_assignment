import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ViewProfile from "./pages/ViewProfile";
import EditProfile from "./pages/EditProfile";
import CreatePost from "./pages/CreatePost";
import MyPosts from "./pages/MyPosts";

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar-glass sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg transition-shadow">
            M
          </div>
          <span className="text-lg font-bold gradient-text tracking-tight">
            MiniSocial
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {user ? (
            <>
              <Link to="/" className="px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/80 transition-all">
                Feed
              </Link>
              <Link to="/create-post" className="px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/80 transition-all">
                New Post
              </Link>
              <Link to="/my-posts" className="px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/80 transition-all">
                My Posts
              </Link>
              <Link to={`/profile/${user._id}`} className="px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/80 transition-all">
                Profile
              </Link>
              <button
                onClick={onLogout}
                className="ml-2 btn-gradient px-4 py-2 rounded-xl text-sm font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/80 transition-all">
                Login
              </Link>
              <Link
                to="/register"
                className="ml-1 btn-gradient px-5 py-2 rounded-xl text-sm font-semibold"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function ProtectedRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
    }
  }, []);

  const handleLogin = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleProfileUpdate = (updatedUser) => {
    const stored = JSON.parse(localStorage.getItem("user"));
    stored.user = updatedUser;
    localStorage.setItem("user", JSON.stringify(stored));
    setUser(updatedUser);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="max-w-3xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register onLogin={handleLogin} />} />
            <Route path="/profile/:id" element={<ViewProfile currentUser={user} />} />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute user={user}>
                  <EditProfile user={user} onUpdate={handleProfileUpdate} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-post"
              element={
                <ProtectedRoute user={user}>
                  <CreatePost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-posts"
              element={
                <ProtectedRoute user={user}>
                  <MyPosts user={user} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;


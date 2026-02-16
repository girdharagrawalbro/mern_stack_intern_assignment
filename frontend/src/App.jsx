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
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-wide">
          MiniSocial
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/" className="hover:text-indigo-200 transition">
                Feed
              </Link>
              <Link to="/create-post" className="hover:text-indigo-200 transition">
                New Post
              </Link>
              <Link to="/my-posts" className="hover:text-indigo-200 transition">
                My Posts
              </Link>
              <Link to={`/profile/${user._id}`} className="hover:text-indigo-200 transition">
                Profile
              </Link>
              <button
                onClick={onLogout}
                className="bg-white text-indigo-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-200 transition">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-indigo-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-100 transition"
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
      <div className="min-h-screen bg-gray-50">
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


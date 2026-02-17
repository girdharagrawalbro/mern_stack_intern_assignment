import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API, { API_BASE_URL } from "../api/axios";

function Home({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await API.get(`${API_BASE_URL}/posts`);
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await API.delete(`${API_BASE_URL}/posts/${postId}`);
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in-up">
        {/* Floating decorative elements */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl animate-float">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-rose-500 opacity-60 animate-float" style={{animationDelay: '0.5s'}} />
          <div className="absolute -bottom-1 -left-3 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 opacity-50 animate-float" style={{animationDelay: '1s'}} />
        </div>
        
        <h1 className="text-5xl font-extrabold mb-3">
          <span className="gradient-text">MiniSocial</span>
        </h1>
        <p className="text-gray-400 text-lg mb-10 max-w-sm leading-relaxed">
          Share your thoughts, connect with others, and discover amazing stories.
        </p>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="btn-gradient px-8 py-3 rounded-2xl font-semibold text-sm tracking-wide shadow-lg"
          >
            Get Started
          </Link>
          <Link
            to="/register"
            className="bg-white/60 backdrop-blur text-gray-700 border border-gray-200/80 px-8 py-3 rounded-2xl font-semibold text-sm hover:bg-white/80 hover:border-gray-300 transition-all"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
        <div className="loading-spinner" />
        <p className="text-gray-400 text-sm">Loading your feed...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">Your Feed</h1>
          <p className="text-gray-400 text-sm mt-0.5">See what everyone is posting</p>
        </div>
        <Link
          to="/create-post"
          className="btn-gradient px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <p className="text-gray-400 text-lg mb-2 font-medium">No posts yet</p>
          <Link
            to="/create-post"
            className="gradient-text font-semibold hover:opacity-80 transition"
          >
            Be the first to post!
          </Link>
        </div>
      ) : (
        <div className="space-y-5 stagger-children">
          {posts.map((post) => (
            <div
              key={post._id}
              className="post-card"
            >
              {/* Author header */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-100/60">
                {post.author?.profilePic ? (
                  <img
                    src={post.author.profilePic}
                    alt={post.author.name}
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-white shadow-sm"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {post.author?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/profile/${post.author?._id}`}
                    className="font-semibold text-gray-800 hover:text-indigo-600 transition text-sm"
                  >
                    {post.author?.name || "Unknown"}
                  </Link>
                  <p className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Delete button (own posts only) */}
                {user && post.author?._id === user._id && (
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                    title="Delete post"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Post content */}
              <div className="p-4">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{post.text}</p>
              </div>

              {/* Post image */}
              {post.image && (
                <div className="px-4 pb-4">
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full rounded-xl object-cover max-h-96 shadow-sm"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;


import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API, { API_BASE_URL } from "../api/axios";

function ViewProfile({ currentUser }) {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwn = currentUser && currentUser._id === id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          API.get(`${API_BASE_URL}/users/profile/${id}`),
          API.get(`${API_BASE_URL}/posts`),
        ]);
        setUser(userRes.data);
        setPosts(postsRes.data.filter((p) => p.author?._id === id));
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await API.delete(`${API_BASE_URL}/posts/${postId}`);
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
        <div className="loading-spinner" />
        <p className="text-gray-400 text-sm">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 animate-fade-in-up">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <p className="text-gray-400 text-lg font-medium">User not found</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Profile Card */}
      <div className="glass-card rounded-3xl overflow-hidden mb-8 relative">
        {/* Gradient banner */}
        <div className="h-28 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute -bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/70 to-transparent" />
        </div>
        
        <div className="px-6 pb-6 -mt-12 relative">
          <div className="flex items-end gap-5 mb-4">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white shadow-lg">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
            )}

            {isOwn && (
              <Link
                to="/edit-profile"
                className="ml-auto mb-1 btn-gradient px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </Link>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">{user.name}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{user.email}</p>
            {user.bio && <p className="text-gray-600 mt-3 leading-relaxed">{user.bio}</p>}
            <div className="flex items-center gap-4 mt-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Joined {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                {posts.length} {posts.length === 1 ? 'post' : 'posts'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User's Posts */}
      <h2 className="text-xl font-extrabold text-gray-800 mb-5">
        {isOwn ? "Your Posts" : `${user.name}'s Posts`}
      </h2>

      {posts.length === 0 ? (
        <div className="text-center py-16 animate-fade-in-up">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <p className="text-gray-400 font-medium">No posts yet</p>
        </div>
      ) : (
        <div className="space-y-5 stagger-children">
          {posts.map((post) => (
            <div
              key={post._id}
              className="post-card"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100/60">
                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
                {isOwn && (
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
              <div className="p-4">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{post.text}</p>
              </div>
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

export default ViewProfile;


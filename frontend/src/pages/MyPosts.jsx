import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API, { API_BASE_URL } from "../api/axios";

function MyPosts({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const { data } = await API.get(`${API_BASE_URL}/posts/my`);
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

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
        <div className="loading-spinner" />
        <p className="text-gray-400 text-sm">Loading your posts...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">My Posts</h1>
          <p className="text-gray-400 text-sm mt-0.5">{posts.length} {posts.length === 1 ? 'post' : 'posts'} published</p>
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
            Create your first post!
          </Link>
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
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                  title="Delete post"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
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
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
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

export default MyPosts;

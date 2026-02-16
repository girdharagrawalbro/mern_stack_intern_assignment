import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function Home({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await API.get("/posts");
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
      await API.delete(`/posts/${postId}`);
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to MiniSocial</h1>
        <p className="text-gray-500 text-lg mb-8 max-w-md">
          A mini social media platform. Share your thoughts, connect with others.
        </p>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-white text-indigo-600 border-2 border-indigo-600 px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-50 transition"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <p className="text-gray-500 text-lg">Loading posts...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Feed</h1>
        <Link
          to="/create-post"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg mb-4">No posts yet</p>
          <Link
            to="/create-post"
            className="text-indigo-600 font-medium hover:underline"
          >
            Be the first to post!
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Author header */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-50">
                {post.author?.profilePic ? (
                  <img
                    src={post.author.profilePic}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    {post.author?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
                <div>
                  <Link
                    to={`/profile/${post.author?._id}`}
                    className="font-semibold text-gray-800 hover:text-indigo-600 transition"
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
                    className="ml-auto text-gray-400 hover:text-red-500 transition text-sm"
                    title="Delete post"
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* Post content */}
              <div className="p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{post.text}</p>
              </div>

              {/* Post image */}
              {post.image && (
                <div className="px-4 pb-4">
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full rounded-lg object-cover max-h-96"
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


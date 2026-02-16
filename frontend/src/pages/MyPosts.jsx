import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function MyPosts({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const { data } = await API.get("/posts/my");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <p className="text-gray-500 text-lg">Loading your posts...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Posts ({posts.length})</h1>
        <Link
          to="/create-post"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg mb-4">You haven't posted anything yet</p>
          <Link
            to="/create-post"
            className="text-indigo-600 font-medium hover:underline"
          >
            Create your first post!
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-50">
                <p className="text-xs text-gray-400">
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
                  className="text-gray-400 hover:text-red-500 transition text-sm font-medium"
                >
                  Delete
                </button>
              </div>

              <div className="p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{post.text}</p>
              </div>

              {post.image && (
                <div className="px-4 pb-4">
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full rounded-lg object-cover max-h-96"
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

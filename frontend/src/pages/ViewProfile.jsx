import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";

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
          API.get(`/users/profile/${id}`),
          API.get("/posts"),
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
      await API.delete(`/posts/${postId}`);
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">User not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-start gap-5">
          {user.profilePic ? (
            <img
              src={user.profilePic}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
            {user.bio && <p className="text-gray-600 mt-2">{user.bio}</p>}
            <p className="text-gray-400 text-xs mt-2">
              Joined {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          {isOwn && (
            <Link
              to="/edit-profile"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
            >
              Edit Profile
            </Link>
          )}
        </div>
      </div>

      {/* User's Posts */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {isOwn ? "Your Posts" : `${user.name}'s Posts`} ({posts.length})
      </h2>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No posts yet</p>
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
                    year: "numeric", month: "short", day: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
                {isOwn && (
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-gray-400 hover:text-red-500 transition text-sm"
                  >
                    Delete
                  </button>
                )}
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


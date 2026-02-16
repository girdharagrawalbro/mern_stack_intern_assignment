const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");
const { postSchema } = require("../validators/schemas");

// CREATE a post (protected)
router.post("/", auth, async (req, res) => {
  try {
    // Validate input
    const result = postSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => e.message);
      return res.status(400).json({ message: errors[0], errors });
    }

    const post = await Post.create({
      text: result.data.text,
      image: result.data.image || "",
      author: req.user.id,
    });

    const populated = await post.populate("author", "name profilePic");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET all posts (public feed)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name profilePic")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET posts by current user (protected)
router.get("/my", auth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .populate("author", "name profilePic")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE own post (protected)
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Only author can delete
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;

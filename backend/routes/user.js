const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const { updateProfileSchema } = require("../validators/schemas");

// GET current user profile (protected)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET user profile by ID
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// UPDATE user profile (protected - own profile only)
router.put("/profile", auth, async (req, res) => {
  try {
    // Validate input
    const result = updateProfileSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => e.message);
      return res.status(400).json({ message: errors[0], errors });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: result.data },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;

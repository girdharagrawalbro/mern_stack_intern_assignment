const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    bio: { type: String, default: "" },
    profilePic: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

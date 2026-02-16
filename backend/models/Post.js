const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    image: { type: String, default: "" },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);

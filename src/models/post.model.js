import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    category: {
      type: String,
    },
    views: {
      type: Number,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const postModel = mongoose.model("post", postSchema);

export default postModel;

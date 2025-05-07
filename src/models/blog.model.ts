import mongoose, { type Document, type Schema } from "mongoose";

interface BlogDocument extends Document {
  title: string;
  content: string;
  author: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new mongoose.Schema<BlogDocument>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const BlogModel = mongoose.model<BlogDocument>("Blog", blogSchema);
export default BlogModel;

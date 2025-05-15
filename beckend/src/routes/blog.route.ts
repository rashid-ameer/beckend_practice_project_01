import { Router } from "express";
import {
  createBlogHandler,
  deleteBlogHandler,
  getAuthorBlogsHandler,
  getBlogHandler,
  getBlogsHandler,
  updateBlogHandler,
} from "../controllers/blog.controller";

const blogRoutes = Router();

// prefix: /blogs
blogRoutes.post("/", createBlogHandler);
blogRoutes.patch("/:id", updateBlogHandler);
blogRoutes.delete("/:id", deleteBlogHandler);
blogRoutes.get("/all/:authorId", getAuthorBlogsHandler);
blogRoutes.get("/:id", getBlogHandler);
blogRoutes.get("/", getBlogsHandler);

export default blogRoutes;

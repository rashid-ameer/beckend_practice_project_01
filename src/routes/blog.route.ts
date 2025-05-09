import { Router } from "express";
import {
  createBlogHandler,
  getBlogsHandler,
} from "../controllers/blog.controller";

const blogRoutes = Router();

// prefix: /blogs
blogRoutes.post("/", createBlogHandler);
blogRoutes.get("/", getBlogsHandler);

export default blogRoutes;

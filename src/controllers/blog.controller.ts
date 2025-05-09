import HTTP_CODES from "../constants/httpCodes";
import BlogModel from "../models/blog.model";
import { createBlogSchema } from "../schemas/blog.schema";
import { mongodbIdSchema } from "../schemas/common.schema";
import { createBlog } from "../services/blog.service";
import asyncHandler from "../utils/asyncHandler";

export const createBlogHandler = asyncHandler(async (req, res) => {
  // validate a request
  const request = createBlogSchema.parse({ ...req.body, author: req.userId });
  // call a service
  const blog = await createBlog(request);
  // send a response
  res
    .status(HTTP_CODES.CREATED)
    .json({ message: "Blog created successfully.", blog });
});

export const getBlogsHandler = asyncHandler(async (req, res) => {
  const userId = mongodbIdSchema(
    "User id is required.",
    "Invalid user id"
  ).parse(req.userId);
  const blogs = await BlogModel.find({ author: userId });
  res
    .status(HTTP_CODES.OK)
    .json({ message: "Blogs fetched successfully.", blogs });
});

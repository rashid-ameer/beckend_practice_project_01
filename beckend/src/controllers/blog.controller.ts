import HTTP_CODES from "../constants/httpCodes";
import BlogModel from "../models/blog.model";
import { createBlogSchema, updateBlogSchema } from "../schemas/blog.schema";
import { mongodbIdSchema } from "../schemas/common.schema";
import {
  createBlog,
  deleteBlog,
  getBlogById,
  getBlogsByAuthorId,
  updateBlog,
} from "../services/blog.service";
import ApiError from "../utils/apiError";
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

export const updateBlogHandler = asyncHandler(async (req, res) => {
  // validate a request
  const request = updateBlogSchema.parse({
    ...req.body,
    blogId: req.params.id,
  });
  // call a service
  const blog = await updateBlog(request);
  // send a response
  res
    .status(HTTP_CODES.OK)
    .json({ message: "Blog updated successfully", blog });
});

export const deleteBlogHandler = asyncHandler(async (req, res) => {
  // validate a request
  const blogId = mongodbIdSchema(
    "Blog id is required.",
    "Invalid blog id"
  ).parse(req.params.id);

  // call a service
  await deleteBlog(blogId);

  // send a response
  res.status(HTTP_CODES.OK).json({ message: "Blog deleted successfully." });
});

export const getBlogHandler = asyncHandler(async (req, res) => {
  // validate a request
  const blogId = mongodbIdSchema(
    "Blog id is required.",
    "Invalid blog id"
  ).parse(req.params.id);

  // call a service
  const blog = await getBlogById(blogId);
  if (!blog) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, "Blog not found.");
  }

  res
    .status(HTTP_CODES.OK)
    .json({ message: "Blog fetched successfully.", blog });
});

export const getBlogsHandler = asyncHandler(async (req, res) => {
  const authorId = mongodbIdSchema(
    "User id is required.",
    "Invalid user id"
  ).parse(req.userId);
  const blogs = await getBlogsByAuthorId(authorId);
  res
    .status(HTTP_CODES.OK)
    .json({ message: "Blogs fetched successfully.", blogs });
});

export const getAuthorBlogsHandler = asyncHandler(async (req, res) => {
  const authorId = mongodbIdSchema(
    "Author id is required",
    "Invalid author id"
  ).parse(req.params.authorId);

  const blogs = await getBlogsByAuthorId(authorId);

  res
    .status(HTTP_CODES.OK)
    .json({ message: "Blogs fetched successfully.", blogs });
});

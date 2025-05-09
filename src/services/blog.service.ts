import HTTP_CODES from "../constants/httpCodes";
import BlogModel from "../models/blog.model";
import ApiError from "../utils/apiError";

interface CreateBlogParams {
  title: string;
  content: string;
  author: string;
}
export const createBlog = async (data: CreateBlogParams) => {
  const blog = await BlogModel.create(data);

  if (!blog) {
    throw new ApiError(
      HTTP_CODES.INTERNAL_SERVER_ERROR,
      "Failed to create blog"
    );
  }
  return blog;
};

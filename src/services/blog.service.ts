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

export const getBlogById = async (blogId: string) => {
  return BlogModel.findById(blogId);
};

export const getBlogsByAuthorId = async (authorId: string) => {
  return BlogModel.find({ author: authorId });
};

interface UpdatedBlogParams {
  blogId: string;
  title?: string;
  content?: string;
}
export const updateBlog = async ({
  blogId,
  title,
  content,
}: UpdatedBlogParams) => {
  const blog = await getBlogById(blogId);
  if (!blog) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, "Blog not found.");
  }

  if (title) {
    blog.title = title;
  }
  if (content) {
    blog.content = content;
  }

  return blog.save();
};

export const deleteBlog = async (blogId: string) => {
  const blog = await BlogModel.findByIdAndDelete(blogId);
  if (!blog) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, "Blog not found.");
  }
};

import { z } from "zod";
import { mongodbIdSchema } from "./common.schema";

export const createBlogSchema = z.object({
  title: z.string({ required_error: "Blog title is requried." }),
  content: z.string({ required_error: "Blog content is required." }),
  author: mongodbIdSchema("User id is required.", "Invalid user id"),
});

export const updateBlogSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  blogId: mongodbIdSchema("Blog id is required.", "Invalid blog id"),
});

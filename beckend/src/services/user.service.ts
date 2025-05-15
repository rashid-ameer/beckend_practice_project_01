import HTTP_CODES from "../constants/httpCodes";
import BlogModel from "../models/blog.model";
import UserModel from "../models/user.model";
import ApiError from "../utils/apiError";

export const getUserById = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, "User not found.");
  }
  return user.omitPassword();
};

export const deleteUser = async (userId: string) => {
  BlogModel.deleteMany({ author: userId });
  UserModel.findByIdAndDelete(userId);
};

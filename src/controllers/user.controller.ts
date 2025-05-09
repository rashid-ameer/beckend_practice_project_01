import { mongodbIdSchema } from "../schemas/common.schema";
import { getUserById } from "../services/user.service";
import asyncHandler from "../utils/asyncHandler";
import HTTP_CODES from "../constants/httpCodes";
import ApiError from "../utils/apiError";

export const getUserHandler = asyncHandler(async (req, res) => {
  // validate a request
  const userId = mongodbIdSchema(
    "User id is required.",
    "Invalid user id."
  ).parse(req.userId);

  // call service
  const user = await getUserById(userId);

  if (!user) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, "User not found.");
  }

  // send response
  res.status(HTTP_CODES.OK).json({
    message: "User fetched successfully.",
    user,
  });
});

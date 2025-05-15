import { mongodbIdSchema } from "../schemas/common.schema";
import { deleteUser, getUserById } from "../services/user.service";
import { clearAuthCookies } from "../utils/cookies";
import asyncHandler from "../utils/asyncHandler";
import HTTP_CODES from "../constants/httpCodes";

export const getUserHandler = asyncHandler(async (req, res) => {
  // validate a request
  const userId = mongodbIdSchema(
    "User id is required.",
    "Invalid user id."
  ).parse(req.userId);

  // call service
  const user = await getUserById(userId);

  // send response
  res.status(HTTP_CODES.OK).json({
    message: "User fetched successfully.",
    user,
  });
});

export const deleteUserHandler = asyncHandler(async (req, res) => {
  const userId = req.userId as string;
  // call a service
  await deleteUser(userId);
  // return a response
  clearAuthCookies(res)
    .status(HTTP_CODES.OK)
    .json({ message: "User deleted successfully." });
});

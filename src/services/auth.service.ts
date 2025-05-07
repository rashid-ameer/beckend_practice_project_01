import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../constants/env";
import UserModel from "../models/user.model";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError";
import HTTP_CODES from "../constants/httpCodes";

interface RegisterUserParams {
  email: string;
  username: string;
  password: string;
}
export const registerUser = async ({
  email,
  username,
  password,
}: RegisterUserParams) => {
  // check if the email already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new ApiError(HTTP_CODES.CONFLICT, "Email already exists");
  }
  // store the user in the database
  const user = await UserModel.create({ email, username, password });

  if (!user) {
    throw new ApiError(
      HTTP_CODES.INTERNAL_SERVER_ERROR,
      "Failed to create user."
    );
  }

  // create access and refresh tokens
  const accessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
  // return the tokens and user information
  return { user: user.omitPassword(), accessToken, refreshToken };
};

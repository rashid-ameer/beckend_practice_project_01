import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../constants/env";
import UserModel from "../models/user.model";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError";
import HTTP_CODES from "../constants/httpCodes";
import { RefreshTokenPayload, verifyToken } from "../utils/jwt";
import ERROR_CODES from "../constants/errorCodes";

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

interface LoginParams {
  email: string;
  password: string;
}
export const login = async ({ email, password }: LoginParams) => {
  // check if user exists
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new ApiError(HTTP_CODES.UNAUTHORIZED, "Incorrect email or password.");
  }

  // compare password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(HTTP_CODES.UNAUTHORIZED, "Incorrect email or password.");
  }

  // create access and refresh token
  const accessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  // return user and tokens
  return { user: user.omitPassword(), accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(
    refreshToken,
    REFRESH_TOKEN_SECRET
  );

  if (!payload) {
    throw new ApiError(
      HTTP_CODES.UNAUTHORIZED,
      "Invalid or expired refresh token",
      ERROR_CODES.INVALID_REFRESH_TOKEN
    );
  }

  const user = await UserModel.findById(payload.userId);
  if (!user) {
    throw new ApiError(
      HTTP_CODES.UNAUTHORIZED,
      "Invalid or expired refresh token",
      ERROR_CODES.INVALID_REFRESH_TOKEN
    );
  }

  const accessToken = jwt.sign({ id: user._id }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const newRefreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  return { accessToken, newRefreshToken };
};

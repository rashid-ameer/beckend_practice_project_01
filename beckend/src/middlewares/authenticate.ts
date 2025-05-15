import { ACCESS_TOKEN_SECRET } from "../constants/env";
import { AccessTokenPayload, verifyToken } from "../utils/jwt";
import ERROR_CODES from "../constants/errorCodes";
import asyncHandler from "../utils/asyncHandler";
import HTTP_CODES from "../constants/httpCodes";
import UserModel from "../models/user.model";
import ApiError from "../utils/apiError";

const authenticate = asyncHandler(async (req, _, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;

  if (!accessToken) {
    throw new ApiError(
      HTTP_CODES.UNAUTHORIZED,
      "Access token is required.",
      ERROR_CODES.INVALID_ACCESS_TOKEN
    );
  }

  const { payload } = verifyToken<AccessTokenPayload>(
    accessToken,
    ACCESS_TOKEN_SECRET
  );
  if (!payload) {
    throw new ApiError(
      HTTP_CODES.UNAUTHORIZED,
      "Invalid or expired access token.",
      ERROR_CODES.INVALID_ACCESS_TOKEN
    );
  }

  const user = await UserModel.findById(payload.userId);

  if (!user) {
    throw new ApiError(
      HTTP_CODES.UNAUTHORIZED,
      "Invalid or expired access token.",
      ERROR_CODES.INVALID_ACCESS_TOKEN
    );
  }

  req.userId = payload.userId;
  next();
});

export default authenticate;

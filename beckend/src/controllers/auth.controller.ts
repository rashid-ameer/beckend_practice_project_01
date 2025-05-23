import { loginSchema, registerSchema } from "../schemas/auth.schema";
import {
  login,
  refreshAccessToken,
  registerUser,
} from "../services/auth.service";
import asyncHandler from "../utils/asyncHandler";
import HTTP_CODES from "../constants/httpCodes";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies";
import ApiError from "../utils/apiError";
import ERROR_CODES from "../constants/errorCodes";

export const registerHandler = asyncHandler(async (req, res) => {
  // validate a request
  const request = registerSchema.parse(req.body);
  // call a service
  const { user, accessToken, refreshToken } = await registerUser(request);
  // return response
  setAuthCookies(res, accessToken, refreshToken)
    .status(HTTP_CODES.CREATED)
    .json({
      message: "User registered successfully",
      data: { user, accessToken },
    });
});

export const loginHandler = asyncHandler(async (req, res) => {
  // validate a request
  const request = loginSchema.parse(req.body);
  // call a service
  const { user, accessToken, refreshToken } = await login(request);
  // return response
  setAuthCookies(res, accessToken, refreshToken)
    .status(HTTP_CODES.OK)
    .json({ message: "Login successfully.", data: { user, accessToken } });
});

export const refreshAccessTokenHandler = asyncHandler(async (req, res) => {
  // validate a request
  const refreshToken = req.cookies.refreshToken as string | undefined;
  if (!refreshToken) {
    throw new ApiError(
      HTTP_CODES.UNAUTHORIZED,
      "Refresh token is required",
      ERROR_CODES.INVALID_REFRESH_TOKEN
    );
  }

  // call a service
  const { accessToken, newRefreshToken } = await refreshAccessToken(
    refreshToken
  );

  // send a response
  setAuthCookies(res, accessToken, newRefreshToken)
    .status(HTTP_CODES.OK)
    .json({ message: "Access token refreshed successfully.", accessToken });
});

export const logoutHandler = asyncHandler(async (_, res) => {
  // send a response
  clearAuthCookies(res)
    .status(HTTP_CODES.OK)
    .json({ message: "Logout successfully." });
});

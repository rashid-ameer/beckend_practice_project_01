import { NODE_ENV } from "../constants/env";
import { registerSchema } from "../schemas/auth.schema";
import { registerUser } from "../services/auth.service";
import asyncHandler from "../utils/asyncHandler";
import HTTP_CODES from "../constants/httpCodes";
import { setAuthCookies } from "../utils/cookies";

export const registerHandler = asyncHandler(async (req, res) => {
  // validate a request
  const request = registerSchema.parse(req.body);
  // call a service
  const { user, accessToken, refreshToken } = await registerUser(request);
  // return response
  setAuthCookies(res, accessToken, refreshToken)
    .status(HTTP_CODES.CREATED)
    .json({ message: "User registered successfully", user });
});

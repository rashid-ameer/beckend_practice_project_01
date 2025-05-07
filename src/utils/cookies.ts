import { CookieOptions, Response } from "express";
import { NODE_ENV } from "../constants/env";

const REFRESH_PATH = "/auth/refresh";

const defaultAuthCookieOptions: CookieOptions = {
  sameSite: "strict",
  secure: NODE_ENV === "production",
  httpOnly: true,
};

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  return res
    .cookie("accessToken", accessToken, {
      ...defaultAuthCookieOptions,
      expires: new Date(Date.now() + 15 * 60 * 1000),
    })
    .cookie("refreshToken", refreshToken, {
      ...defaultAuthCookieOptions,
      expires: new Date(Date.now() + 30 * 60 * 60 * 1000),
      path: REFRESH_PATH,
    });
};

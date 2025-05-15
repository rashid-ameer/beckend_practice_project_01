import jwt from "jsonwebtoken";

export interface AccessTokenPayload {
  userId: string;
}

export interface RefreshTokenPayload {
  userId: string;
}

export const verifyToken = <T>(token: string, secret: string) => {
  try {
    const payload = jwt.verify(token, secret) as T;
    return { payload };
  } catch (error) {
    return { error };
  }
};

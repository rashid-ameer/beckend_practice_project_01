const getEnv = (key: string, defaultValue?: string) => {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing environment variable ${key}`);
  }
  return value;
};

export const PORT = getEnv("PORT");
export const NODE_ENV = getEnv("NODE_ENV");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
export const ACCESS_TOKEN_SECRET = getEnv("ACCESS_TOKEN_SECRET");
export const REFRESH_TOKEN_SECRET = getEnv("REFRESH_TOKEN_SECRET");
export const MONGODB_CONNECTION_URI = getEnv("MONGODB_CONNECTION_URI");

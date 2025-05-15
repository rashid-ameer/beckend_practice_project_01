import { createContext, useLayoutEffect, useState } from "react";
import api from "../config/api";

export const AuthContext = createContext(undefined);

function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useLayoutEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        config.headers["Authorization"] =
          !config.retry && token
            ? `Bearer ${token}`
            : config.headers.Authorization;

        return config;
      },
      (error) => error
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;

        if (error.response.data.errorCode === "INVALID_REFRESH_TOKEN") {
          try {
            const res = await api.get("/users");
            setToken(res.data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
            originalRequest.retry = true;
            return api(originalRequest);
          } catch {
            setToken(null);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  return (
    <AuthContext value={{ token, user, isAuthenticating, setToken }}>
      {children}
    </AuthContext>
  );
}

export default AuthProvider;

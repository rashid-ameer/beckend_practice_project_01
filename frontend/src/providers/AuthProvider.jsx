import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import api from "../config/api";
import { useNavigate } from "react-router";

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    try {
      setIsAuthenticating(true);
      const res = await api.get("/auth/refresh");
      setToken(res.data.accessToken);
    } catch (error) {
      console.log(error);
      navigate("/login", { replace: true });
    } finally {
      setIsAuthenticating(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useLayoutEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        config.headers.Authorization =
          !config.retry && token
            ? `Bearer ${token}`
            : config.headers.Authorization;

        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;

        if (error.response.data.errorCode === "INVALID_ACCESS_TOKEN") {
          try {
            const res = await api.get("/auth/refresh");
            setToken(res.data.accessToken);
            console.log(res.data.accessToken);
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
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  const isAuthenticated = !!token;

  return (
    <AuthContext value={{ setToken, isAuthenticating, isAuthenticated }}>
      {children}
    </AuthContext>
  );
};

export default AuthProvider;

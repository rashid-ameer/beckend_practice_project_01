import { useEffect, useLayoutEffect, useRef, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router";
import api from "../config/api";

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const isRefreshing = useRef(false);
  const refreshQueue = useRef([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
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
    };
    fetchUser();
  }, []);

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
      console.log("AuthProvider");
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;

        if (error.response.data.errorCode === "INVALID_ACCESS_TOKEN") {
          if (!isRefreshing.current) {
            isRefreshing.current = true;

            try {
              const res = await api.get("/auth/refresh");
              const token = res.data.accessToken;
              refreshQueue.current.forEach((callback) => callback(token));
              refreshQueue.current = [];
              setToken(token);
              originalRequest.headers.Authorization = `Bearer ${token}`;
              originalRequest.retry = true;
              return api(originalRequest);
            } catch {
              refreshQueue.current = [];
              setToken(null);
              navigate("/login", { replace: true });
            }
          }

          return new Promise((resolve) => {
            refreshQueue.current.push((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              originalRequest.retry = true;
              return resolve(api(originalRequest));
            });
          });
        }

        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext value={{ setToken, isAuthenticating, isAuthenticated }}>
      {children}
    </AuthContext>
  );
};

export default AuthProvider;

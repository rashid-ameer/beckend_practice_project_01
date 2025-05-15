import { createContext, useEffect, useLayoutEffect, useState } from "react";
import api from "../config/api";
import { useNavigate } from "react-router";

export const AuthContext = createContext(undefined);

function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      setIsAuthenticating(true);
      const res = await api.get("/users");
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useLayoutEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        config.headers["Authorization"] =
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
    const refreshInterceptor = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;
        console.log("Response interceptors", error.response.data);
        if (error.response.data.errorCode === "INVALID_ACCESS_TOKEN") {
          try {
            const res = await api.get("/auth/refresh");
            setToken(res.data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
            originalRequest.retry = true;
            return api(originalRequest);
          } catch {
            setToken(null);
            navigate("/login", {
              replace: true,
              state: { from: window.location.pathname },
            });
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, [navigate]);

  return (
    <AuthContext
      value={{ token, user, isAuthenticating, setToken, isAuthenticated }}>
      {children}
    </AuthContext>
  );
}

export default AuthProvider;

import { Router } from "express";
import {
  loginHandler,
  logoutHandler,
  refreshAccessTokenHandler,
  registerHandler,
} from "../controllers/auth.controller";
import authenticate from "../middlewares/authenticate";

const authRoutes = Router();

// prefix: /auth

authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/refresh", refreshAccessTokenHandler);

// protected route
authRoutes.use(authenticate);
authRoutes.get("/logout", logoutHandler);

export default authRoutes;

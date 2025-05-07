import { Router } from "express";
import {
  loginHandler,
  logoutHandler,
  refreshAccessTokenHandler,
  registerHandler,
} from "../controllers/auth.controller";

const authRoutes = Router();

// prefix: /auth

authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/refresh", refreshAccessTokenHandler);
authRoutes.get("/logout", logoutHandler);

export default authRoutes;

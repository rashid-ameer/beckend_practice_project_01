import { Router } from "express";
import {
  deleteUserHandler,
  getUserHandler,
} from "../controllers/user.controller";

const userRoutes = Router();

// prefix: /users

userRoutes.get("/", getUserHandler);
userRoutes.delete("/", deleteUserHandler);

export default userRoutes;

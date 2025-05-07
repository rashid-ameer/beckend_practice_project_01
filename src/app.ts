import express from "express";
import errorHandler from "./utils/errorHandler";
import HTTP_CODES from "./constants/httpCodes";
import authRoutes from "./routes/auth.route";
import cookieParser from "cookie-parser";
import cors from "cors";
import { APP_ORIGIN } from "./constants/env";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

// routes
app.use("/auth", authRoutes);

// health check
app.use("/", (_, res) => {
  res.status(HTTP_CODES.OK).json({ health: "100%" });
});

// error handler middleware
app.use(errorHandler);

export default app;

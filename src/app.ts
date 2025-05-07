import express from "express";
import errorHandler from "./utils/errorHandler";
import HTTP_CODES from "./constants/httpCodes";

const app = express();

// health check
app.use("/", (_, res) => {
  res.status(HTTP_CODES.OK).json({ health: "100%" });
});

// error handler middleware
app.use(errorHandler);

export default app;

import { ErrorRequestHandler } from "express";
import HTTP_CODES from "src/constants/httpCodes";

const errorHandler: ErrorRequestHandler = async (error, req, res, _) => {
  console.log(`Path: ${req.path} ---- Method: ${req.method}`);

  res
    .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
    .json({ message: "Internal server error." });
};

export default errorHandler;

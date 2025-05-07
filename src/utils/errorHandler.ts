import { ErrorRequestHandler } from "express";
import HTTP_CODES from "../constants/httpCodes";
import { ZodError } from "zod";

const errorHandler: ErrorRequestHandler = async (error, req, res, _) => {
  console.log(`Path: ${req.path} ---- Method: ${req.method}`);
  console.log(error);

  if (error instanceof ZodError) {
    res
      .status(HTTP_CODES.BAD_REQUEST)
      .json({ message: error.errors[0].message });
    return;
  }

  res
    .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
    .json({ message: "Internal server error." });
};

export default errorHandler;

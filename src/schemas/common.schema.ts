import mongoose from "mongoose";
import { z } from "zod";

export const mongodbIdSchema = (requiredError: string, message: string) =>
  z
    .string({ required_error: requiredError })
    .refine((value) => mongoose.Types.ObjectId.isValid(value), { message });

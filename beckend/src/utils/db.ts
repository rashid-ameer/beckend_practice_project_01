import mongoose from "mongoose";
import { MONGODB_CONNECTION_URI } from "../constants/env";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(MONGODB_CONNECTION_URI);
    console.log(
      `Database connected ---- Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Error connecting database: ", error);
    process.exit(1);
  }
};

export default connectDB;

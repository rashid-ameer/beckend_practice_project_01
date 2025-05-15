import mongoose, { type Document } from "mongoose";
import { hashPassword, verifyPassword } from "../utils/argon2";

interface UserDocument extends Document {
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (value: string) => Promise<boolean>;
  omitPassword: () => Omit<UserDocument, "password">;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = await hashPassword(this.password);
    this.password = hashedPassword;
  }
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return verifyPassword(this.password, password);
};

userSchema.methods.omitPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;

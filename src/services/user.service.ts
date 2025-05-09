import UserModel from "../models/user.model";

export const getUserById = async (userId: string) => {
  const user = await UserModel.findById(userId);
  return user?.omitPassword();
};

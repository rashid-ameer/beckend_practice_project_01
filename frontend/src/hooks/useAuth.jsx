import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";

const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext can only be used in side AuthProvider");
  }

  return authContext;
};

export default useAuth;

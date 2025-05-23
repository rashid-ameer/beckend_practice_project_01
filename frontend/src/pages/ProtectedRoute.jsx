import { Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";

function ProtectedRoute() {
  const { isAuthenticated, isAuthenticating } = useAuth();

  console.log("I ran ProtectedRoute");

  if (isAuthenticating) {
    return <div>Loading....</div>;
  }

  if (isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to={"/login"} replace />;
}
export default ProtectedRoute;

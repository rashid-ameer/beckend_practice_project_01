import { Routes, Route } from "react-router";
import ProtectedRoute from "./pages/ProtectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Global from "./pages/Global";
function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route element={<Global />}>
          <Route index element={<Home />} />
        </Route>
      </Route>
    </Routes>
  );
}
export default App;

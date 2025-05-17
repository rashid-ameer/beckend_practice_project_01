import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import api from "../config/api";

function Global() {
  const [user, setUser] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await api.get("/users");
      setUser(res.data.user);
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return <Outlet context={user} />;
}
export default Global;

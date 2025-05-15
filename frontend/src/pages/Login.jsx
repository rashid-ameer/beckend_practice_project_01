import { useState } from "react";
import api from "../config/api";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", form);
      setToken(res.data.data.accessToken);
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          onChange={(e) => updateForm("email", e.target.value)}
          value={form.email}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={(e) => updateForm("password", e.target.value)}
          value={form.password}
        />
      </div>

      <button>Submit</button>
    </form>
  );
}
export default Login;

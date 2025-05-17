import { useState } from "react";
import api from "../config/api";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { setToken,} = useAuth();
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
    <form onSubmit={handleSubmit} className="px-4 py-6 grid gap-4">
      <div className="grid gap-0.5">
        <label htmlFor="email">Email</label>
        <input
          className="border border-gray-300 focus-within:border-pink-800 focus:outline-pink-800 h-10 px-4 rounded-md"
          type="email"
          name="email"
          id="email"
          autoComplete="email"
          onChange={(e) => updateForm("email", e.target.value)}
          value={form.email}
        />
      </div>
      <div className="grid gap-0.5">
        <label htmlFor="password">Password</label>
        <input
          className="border border-gray-300 focus-within:border-pink-800 focus:outline-pink-800 h-10 px-4 rounded-md"
          type="password"
          name="password"
          id="password"
          autoComplete="current-password"
          onChange={(e) => updateForm("password", e.target.value)}
          value={form.password}
        />
      </div>

      <button className="h-10 px-4 rounded-md bg-gray-900 text-white">
        Submit
      </button>
    </form>
  );
}
export default Login;

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:1000/api/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
      console.log("Login successful", res.data);
      navigate("/home", { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Error setting password";
      if (msg === "Password not set.") {
        alert("You need to set your password first.");
        navigate("/setPassword");
      } else {
        alert(msg);
      }
    }
  };

  const goToSetPassword = () => {
    navigate("/setPassword");
  };

  const goToRequestReset = () => {
    navigate("/requestPasswordReset");
  };

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
      <p>First time user?</p>
      <button type="button" onClick={goToSetPassword}>
        Set Password
      </button>
      <p>
        Forgot password? <a onClick={goToRequestReset}>Reset here</a>
      </p>
    </form>
  );
}

import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const token = searchParams.get("token");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:1000/api/auth/reset-password", {
        token,
        password,
      });
      alert("Password reset successful!");
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed.");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Set New Password</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New password"
      />
      <button type="submit">Reset Password</button>
    </form>
  );
}

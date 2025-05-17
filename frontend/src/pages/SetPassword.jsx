// pages/SetPassword.js
import { useState } from "react";
import axios from "axios";

export default function SetPassword() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await axios.post("http://localhost:1000/api/auth/set-password", {
        username,
        password,
      });
      alert("Password set. You can now log in.");
      window.location.href = "/login";
      setDone(true);
    } catch (err) {
      alert(err.response.data.message || "Error setting password");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Set Your Password</h2>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New Password"
        required
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
        required
      />
      <button type="submit">Set Password</button>
    </form>
  );
}

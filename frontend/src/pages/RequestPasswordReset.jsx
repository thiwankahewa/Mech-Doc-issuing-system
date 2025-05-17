import React, { useState } from "react";
import axios from "axios";

export default function RequestPasswordReset() {
  const [email, setEmail] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:1000/api/auth/request-password-reset",
        { email }
      );
      alert("Check your email for the reset link.");
    } catch (err) {
      alert(err.response?.data?.message || "Error sending reset email.");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Reset Password</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
      />
      <button type="submit">Request Reset Link</button>
    </form>
  );
}

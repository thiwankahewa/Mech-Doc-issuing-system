require("dotenv").config();
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.setPassword = async (req, res) => {
  const { username, password } = req.body;
  console.log("Setting password for user:", username);

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    console.log("users available", rows);
    if (rows.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const user = rows[0];
    if (user.password_hash)
      return res
        .status(400)
        .json({ success: false, message: "Password already set" });

    const hashed = await bcrypt.hash(password, 10);
    await db.execute("UPDATE users SET password_hash = ? WHERE username = ?", [
      hashed,
      username,
    ]);

    res.json({ success: true, message: "Password set successfully" });
  } catch (err) {
    console.error("Set password error:", err); // <--- ADD THIS
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [
    username,
  ]);
  console.log("trying login for user:", username);
  if (rows.length === 0)
    return res
      .status(400)
      .json({ success: false, message: "Invalid username" });

  const user = rows[0];

  if (!user.password_hash)
    return res
      .status(400)
      .json({ success: false, message: "Password not set." });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match)
    return res
      .status(400)
      .json({ success: false, message: "Password is incorrect " });

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );

  res.json({ success: true, token });
};

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  console.log("requesting password reset for:", email);
  const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [
    email,
  ]);
  if (rows.length === 0)
    return res.status(400).json({ message: "No user found with this email" });

  const user = rows[0];
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 3600000) // 1 hour from now
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  await db.execute(
    "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?",
    [token, expires, user.id]
  );

  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: "Password Reset",
    html: `Click <a href="${resetLink}">here</a> to reset your password.`,
  });

  res.json({ message: "Password reset link sent to your email." });
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?",
    [token, Date.now()]
  );

  if (rows.length === 0)
    return res.status(400).json({ message: "Invalid or expired token" });

  const hashed = await bcrypt.hash(password, 10);
  await db.execute(
    "UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
    [hashed, rows[0].id]
  );

  res.json({ message: "Password reset successful." });
};

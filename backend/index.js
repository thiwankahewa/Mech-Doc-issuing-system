require("dotenv").config();
const path = require("path");

const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const letterheadRoutes = require("./routes/letterheadRoutes");
const publicRoutes = require("./routes/publicRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/letterhead", letterheadRoutes);
app.use("/api", publicRoutes);

app.use("/generated", express.static(path.join(__dirname, "generated")));
app.use(
  "/signed_letters",
  express.static(path.join(__dirname, "signed_letters"))
);

// Start server
const PORT = 1000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

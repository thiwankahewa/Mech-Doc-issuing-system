const express = require("express");
const router = express.Router();
const {
  login,
  setPassword,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/set-password", setPassword);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

module.exports = router;

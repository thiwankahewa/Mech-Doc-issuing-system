const express = require("express");
const router = express.Router();
const { verify } = require("../controllers/publicController");

router.get("/verify", verify);

module.exports = router;

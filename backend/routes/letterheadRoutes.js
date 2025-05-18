const express = require("express");
const router = express.Router();
const {
  generate,
  uploadSignedLetter,
  search,
} = require("../controllers/LHController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/generate", auth, generate);
router.post(
  "/upload-signed",
  auth,
  upload.single("signedFile"),
  uploadSignedLetter
);
router.get("/search", auth, search);

module.exports = router;

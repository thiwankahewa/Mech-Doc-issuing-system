const db = require("../config/db");

exports.verify = async (req, res) => {
  const { refNo } = req.query;
  if (!refNo)
    return res.status(400).json({ message: "Reference number required" });

  try {
    const [rows] = await db.query(
      "SELECT refNo, recipient, signed_at, signed FROM letterheads WHERE refNo = ?",
      [refNo]
    );
    if (!rows.length)
      return res.status(404).json({ message: "Letterhead not found" });

    const data = rows[0];

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

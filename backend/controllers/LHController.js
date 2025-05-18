const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const db = require("../config/db");

exports.generate = async (req, res) => {
  const { reason, recipient } = req.body;
  const user = req.user;
  const refNo = `REF-${Date.now().toString().slice(-6)}-${Math.floor(
    Math.random() * 1000
  )}`;
  //const verifyUrl = `http://localhost:3000/verify/${refNo}`;

  try {
    // Load docx template
    const templatePath = path.resolve(
      __dirname,
      "../templates/letterhead.docx"
    );
    const content = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    try {
      doc.render({ refNo: refNo });
    } catch (error) {
      console.error("Doc rendering error:", error);
      throw error;
    }

    const buffer = doc.getZip().generate({ type: "nodebuffer" });
    const fileName = `${refNo}.docx`;
    const filePath = path.join(__dirname, `../generated/${fileName}`);
    fs.writeFileSync(filePath, buffer);

    // Store metadata in DB
    await db.query(
      "INSERT INTO letterheads (refNo, reason, recipient, created_by, file_path, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [refNo, reason, recipient, user.id, fileName]
    );

    res.json({
      refNo,
      downloadUrl: `http://localhost:1000/generated/${fileName}`,
    });
  } catch (err) {
    console.error("Error generating letterhead:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.uploadSignedLetter = async (req, res) => {
  const refNo = req.body.refNo;
  const file = req.file;

  if (!file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const [rows] = await db.query("SELECT * FROM letterheads WHERE refNo = ?", [
      refNo,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Ref No not found" });
    }

    const filePath = file.filename;

    await db.query(
      "UPDATE letterheads SET signed = ?, signed_file_path = ?, signed_at = NOW() WHERE refNo = ?",
      [true, filePath, refNo]
    );

    res.json({ message: "Signed document uploaded successfully" });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.search = async (req, res) => {
  const { refNo, created_by, recipient, fromDate, toDate } = req.query;
  console.log("recieving search query");

  let query = `
  SELECT 
    l.refNo, 
    l.reason, 
    l.recipient, 
    l.created_at, 
    u.username AS created_by, 
    l.signed, 
    l.signed_file_path 
  FROM letterheads l
  JOIN users u ON l.created_by = u.id
  WHERE 1=1
`;
  let params = [];

  if (refNo) {
    query += " AND refNo LIKE ?";
    params.push(`%${refNo}%`);
  }

  if (created_by) {
    query += " AND u.username LIKE ?";
    params.push(`%${created_by}%`);
  }

  if (recipient) {
    query += " AND recipient LIKE ?";
    params.push(`%${recipient}%`);
  }

  if (fromDate && toDate) {
    query += " AND DATE(created_at) BETWEEN ? AND ?";
    params.push(fromDate, toDate);
  }

  try {
    const [results] = await db.query(query, params);
    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Search failed" });
  }
};

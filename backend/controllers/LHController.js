const fs = require("fs");
const path = require("path");
const db = require("../config/db");
const puppeteer = require("puppeteer");
const QRCode = require("qrcode");

exports.generate = async (req, res) => {
  const { recipient, content, refNo } = req.body;
  const user = req.user;

  const newRefNo =
    refNo ||
    `REF-${Date.now().toString().slice(-6)}-${Math.floor(
      Math.random() * 1000
    )}`;

  const qrCodeDataUrl = await QRCode.toDataURL("https://yourdomain.com");

  const fileNamePdf = `${refNo}.pdf`;
  const filePathPdf = path.join(__dirname, `../generated/${fileNamePdf}`);

  // Load the HTML letterhead template
  const letterheadHtmlPath = path.join(
    __dirname,
    "../htmlTemplates/letterhead.html"
  );
  const footerHtmlPath = path.join(__dirname, "../htmlTemplates/footer.html");

  let letterheadHtml = fs.readFileSync(letterheadHtmlPath, "utf-8");
  let footerHtml = fs.readFileSync(footerHtmlPath, "utf-8");

  const today = new Date();
  const formattedDate = today
    .toLocaleDateString("en-GB") // This gives dd/mm/yyyy format
    .replace(/\//g, "/"); // Ensure slash format

  letterheadHtml = letterheadHtml
    .replace("{{content}}", content)
    .replace("{{date}}", formattedDate);

  footerHtml = footerHtml
    .replace("{{refNo1}}", newRefNo)
    .replace("{{refNo2}}", newRefNo)
    .replace("{{qr}}", qrCodeDataUrl);

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(letterheadHtml, { waitUntil: "networkidle0" });

    await page.pdf({
      path: filePathPdf,
      format: "A4",
      margin: { top: "10mm", bottom: "40mm", left: "20mm", right: "20mm" },
      displayHeaderFooter: true,
      footerTemplate: footerHtml,
      headerTemplate: `<div></div>`,
    });

    await browser.close();

    await db.query(
      `INSERT INTO letterheads (refNo, recipient, created_by, file_path, created_at)
       VALUES (?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
         recipient = VALUES(recipient),
         created_by = VALUES(created_by),
         file_path = VALUES(file_path),
         created_at = NOW()`,
      [newRefNo, recipient, user.id, fileNamePdf]
    );

    res.json({
      newRefNo,
      downloadUrl: `http://localhost:1000/generated/${fileNamePdf}`,
    });
  } catch (err) {
    console.error("Error generating PDF:", err);
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

    if (rows[0].signed && rows[0].signed_file_path) {
      return res
        .status(409)
        .json({
          message:
            "A signed document already exists for this reference number.",
        });
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

  if (fromDate && toDate && fromDate === toDate) {
    query += " AND DATE(l.created_at) = ?";
    params.push(fromDate);
  } else if (fromDate && toDate) {
    query += " AND DATE(l.created_at) BETWEEN ? AND ?";
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

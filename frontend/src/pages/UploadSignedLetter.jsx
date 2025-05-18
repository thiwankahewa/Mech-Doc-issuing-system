import { useState } from "react";
import axios from "axios";

export default function UploadSignedLetter() {
  const [refNo, setRefNo] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!refNo || !file) {
      return alert("Please enter reference number and select a file.");
    }

    const formData = new FormData();
    formData.append("refNo", refNo);
    formData.append("signedFile", file);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:1000/api/letterhead/upload-signed",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStatus("Signed document uploaded successfully.");
      setRefNo("");
      setFile(null);
    } catch (err) {
      alert(err.response?.data?.message || "Upload Failed");
    }
  };

  return (
    <form onSubmit={handleUpload} style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Upload Signed Letter</h2>
      <div>
        <label>Reference Number:</label>
        <input
          type="text"
          value={refNo}
          onChange={(e) => {
            let value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-digits
            if (value.length > 6) {
              value = value.slice(0, 6) + "-" + value.slice(6, 9); // Limit to 6-3 format
            }
            setRefNo("REF-" + value);
          }}
          required
        />
      </div>
      <div>
        <label>Signed File (PDF or Image):</label>
        <input
          type="file"
          accept=".pdf, image/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
      </div>
      <button type="submit" style={{ marginTop: "10px" }}>
        Upload
      </button>
      {status && <p>{status}</p>}
    </form>
  );
}

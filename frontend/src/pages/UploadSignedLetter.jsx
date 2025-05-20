import { useState } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function UploadSignedLetter() {
  const [refNo, setRefNo] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!refNo || !file) {
      setError("Please enter reference number and select a file.");
      return;
    }

    setLoading(true);
    setError("");
    setStatus("");

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
      setError(err.response?.data?.message || "Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f5f7fa"
    >
      <Paper
        elevation={5}
        sx={{ p: 4, minWidth: 350, maxWidth: 500, width: "100%" }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          color="primary"
          align="center"
          gutterBottom
        >
          Upload Signed Letter
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 2 }}
        >
          Upload the signed letter (PDF or image) with its reference number.
        </Typography>
        <form onSubmit={handleUpload}>
          <Stack spacing={2}>
            <TextField
              label="Reference Number"
              value={refNo}
              onChange={(e) => {
                let value = e.target.value.replace(/[^0-9]/g, "");
                if (value.length > 6) {
                  value = value.slice(0, 6) + "-" + value.slice(6, 9);
                }
                setRefNo("REF-" + value);
              }}
              required
              fullWidth
              disabled={loading}
              placeholder="REF-XXXXXX-XXX"
            />
            <Button
              variant="outlined"
              component="label"
              color={file ? "success" : "primary"}
              startIcon={file ? <CheckCircleIcon /> : <CloudUploadIcon />}
              sx={{ fontWeight: 600 }}
              disabled={loading}
            >
              {file ? file.name : "Select Signed File"}
              <input
                type="file"
                accept=".pdf, image/*"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
                required
                disabled={loading}
              />
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<CloudUploadIcon />}
              sx={{ fontWeight: 600 }}
              disabled={loading}
              fullWidth
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
            {status && <Alert severity="success">{status}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

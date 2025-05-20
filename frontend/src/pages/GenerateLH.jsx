import { useState } from "react";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import DownloadIcon from "@mui/icons-material/Download";
import PreviewIcon from "@mui/icons-material/Preview";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentIcon from "@mui/icons-material/Assignment";

export default function GenerateLH() {
  const [recipient, setRecipient] = useState("");
  const [letterContent, setLetterContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [refNo, setRefNo] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [hasPreviewed, setHasPreviewed] = useState(false);
  const [hasEdited, setHasEdited] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRefNo(null);
    setError("");
    setSuccess("");
    try {
      const res = await axios.post(
        "http://localhost:1000/api/letterhead/generate",
        { recipient, content: letterContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRefNo(res.data.newRefNo);
      setFileUrl(res.data.downloadUrl);
      setHasEdited(false);
      setSuccess("Letterhead generated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate letterhead");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(fileUrl, {
        method: "GET",
        headers: {},
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileUrl.split("/").pop() || "letterhead.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setRecipient("");
      setLetterContent("");
      setRefNo(null);
      setFileUrl("");
      setSuccess("Downloaded successfully!");
    } catch (err) {
      setError("Failed to download PDF");
    }
  };

  const handlePreview = () => {
    window.open(fileUrl, "_blank");
    setHasPreviewed(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.post(
        "http://localhost:1000/api/letterhead/generate",
        { recipient, content: letterContent, refNo },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFileUrl(res.data.downloadUrl);
      setHasPreviewed(false);
      setHasEdited(false);
      setSuccess("Letterhead updated!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to edit letterhead");
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
        sx={{ p: 4, minWidth: 350, maxWidth: 600, width: "100%" }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          color="primary"
          align="center"
          gutterBottom
        >
          <AssignmentIcon sx={{ mr: 1, mb: "-4px" }} />
          Generate New Letterhead
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 2 }}
        >
          Fill in the recipient and compose your letter below.
        </Typography>
        <form onSubmit={submit}>
          <Stack spacing={2}>
            <TextField
              label="To (Person / Organization)"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
              fullWidth
              disabled={loading || !!refNo}
            />
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Letter Content
              </Typography>
              <Paper variant="outlined" sx={{ p: 1, minHeight: 120 }}>
                <Editor
                  apiKey="6a1hyck2dk0gvrkaag87h6m4adb7g59dzj3ixf0skyul8qal"
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: "lists link",
                    toolbar:
                      "undo redo | bold underline italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
                    branding: false,
                  }}
                  value={letterContent}
                  onEditorChange={(newValue) => setLetterContent(newValue)}
                  disabled={loading || (!!refNo && hasPreviewed)}
                />
              </Paper>
            </Box>
            {!hasPreviewed && hasEdited && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <AssignmentIcon />
                  )
                }
                sx={{ fontWeight: 600 }}
                fullWidth
              >
                {loading ? "Generating..." : "Generate Letterhead"}
              </Button>
            )}
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
          </Stack>
        </form>
        {refNo && (
          <Box mt={4} p={2} borderRadius={2} bgcolor="#e8f5e9">
            <Typography variant="subtitle1" fontWeight={600} color="primary">
              Reference No: {refNo}
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={2}>
              {!hasPreviewed ? (
                <Button
                  onClick={handlePreview}
                  variant="contained"
                  color="info"
                  startIcon={<PreviewIcon />}
                  fullWidth
                  sx={{ fontWeight: 600 }}
                >
                  Preview PDF
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    disabled={loading}
                    variant="contained"
                    color="secondary"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    fullWidth
                    sx={{ fontWeight: 600 }}
                  >
                    {loading ? "Editing..." : "Edit"}
                  </Button>
                  <Button
                    onClick={handleDownload}
                    disabled={loading}
                    variant="contained"
                    color="success"
                    startIcon={<DownloadIcon />}
                    fullWidth
                    sx={{ fontWeight: 600 }}
                  >
                    Download PDF
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import LogoutIcon from "@mui/icons-material/Logout";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SearchIcon from "@mui/icons-material/Search";

export default function Home() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
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
        sx={{ p: 5, minWidth: 350, maxWidth: 480, borderRadius: 4 }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          color="primary"
          align="center"
          gutterBottom
        >
          Document Issuing System
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          align="center"
          sx={{ mb: 3 }}
        >
          Welcome! You are logged in.
        </Typography>
        <Stack spacing={3} sx={{ mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<NoteAddIcon />}
            onClick={() => navigate("/generateLH")}
            sx={{ fontWeight: 600 }}
            fullWidth
          >
            Generate New Letterhead
          </Button>
          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={<CloudUploadIcon />}
            onClick={() => navigate("/upload-signed")}
            sx={{ fontWeight: 600 }}
            fullWidth
          >
            Upload Signed Letter
          </Button>
          <Button
            variant="contained"
            color="warning"
            size="large"
            startIcon={<SearchIcon />}
            onClick={() => navigate("/search-doc")}
            sx={{ fontWeight: 600 }}
            fullWidth
          >
            Search Issued Letters
          </Button>
        </Stack>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={logout}
          fullWidth
          sx={{ fontWeight: 600 }}
        >
          Logout
        </Button>
      </Paper>
    </Box>
  );
}

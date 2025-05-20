import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LoginIcon from "@mui/icons-material/Login";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../assets/logo.png";

export default function PublicLanding() {
  const [refNo, setRefNo] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!refNo.trim()) return alert("Please enter a reference number.");
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await axios.get(
        `http://localhost:1000/api/verify?refNo=${refNo}`
      );
      setData(res.data);
      setError("");
    } catch (err) {
      setData(null);
      setError(err.response?.data?.message || "Error verifying letterhead");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    const confirmed = window.confirm(
      "Only authorized personnel can log in. Do you want to proceed?"
    );
    if (confirmed) {
      navigate("/login");
    }
  };

  return (
    <Container maxWidth="md" sx={{ minHeight: "100vh", py: 6 }}>
      {/* University Header */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems="center"
        justifyContent="center"
        mb={3}
      >
        <Box
          component="img"
          src={logo}
          alt="University Logo"
          sx={{
            width: 80,
            height: 80,
            mr: { sm: 3, xs: 0 },
            mb: { xs: 2, sm: 0 },

            objectFit: "contain",
            background: "#fff",
          }}
        />
        <Box textAlign={{ xs: "center", sm: "left" }}>
          <Typography variant="h5" fontWeight={700} color="black">
            University of Moratuwa
          </Typography>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            color="text.secondary"
          >
            Department of Mechanical Engineering
          </Typography>
        </Box>
      </Box>
      {/* End University Header */}
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          mb: 4,
          py: 3,
          px: { xs: 2, sm: 6 },
          borderRadius: 3,
          background: "linear-gradient(90deg, #e3f2fd 0%, #fff 100%)",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight={700}
          color="primary"
          gutterBottom
        >
          Verify Documents
        </Typography>
        <Typography align="center" color="text.secondary" sx={{ mb: 2 }}>
          Enter your document reference number to verify its authenticity.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{ mb: 2 }}
        >
          <TextField
            label="Reference Number"
            variant="outlined"
            value={refNo}
            onChange={(e) => {
              let value = e.target.value.replace(/[^0-9]/g, "");
              if (value.length > 6) {
                value = value.slice(0, 6) + "-" + value.slice(6, 9);
              }
              setRefNo("REF-" + value);
            }}
            placeholder="REF-XXXXXX-XXX"
            sx={{ width: { xs: "100%", sm: 350 } }}
            inputProps={{ maxLength: 14 }}
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Verify"
            )}
          </Button>
        </Stack>
        {error && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            justifyContent="center"
            sx={{ mt: 1 }}
          >
            <ErrorOutlineIcon color="error" />
            <Typography color="error" variant="subtitle1">
              {error}
            </Typography>
          </Stack>
        )}
        {data && (
          <Box mt={4} display="flex" justifyContent="center">
            <Card sx={{ minWidth: 350, maxWidth: 500, boxShadow: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Document Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>
                  <Typography>
                    <strong>Reference No:</strong> {data.refNo}
                  </Typography>
                  <Typography>
                    <strong>Recipient:</strong> {data.recipient}
                  </Typography>
                  <Typography>
                    <strong>Signed At:</strong>{" "}
                    {data.signed_at
                      ? new Date(data.signed_at).toLocaleString()
                      : "-"}
                  </Typography>
                  <Typography>
                    <strong>Status:</strong>{" "}
                    {data.signed === 1 ? (
                      <span style={{ color: "#388e3c", fontWeight: 600 }}>
                        <CheckCircleIcon
                          fontSize="small"
                          sx={{ mr: 0.5, mb: "-3px" }}
                        />
                        Signed
                      </span>
                    ) : data.signed === 0 ? (
                      <span style={{ color: "#fbc02d", fontWeight: 600 }}>
                        <HourglassEmptyIcon
                          fontSize="small"
                          sx={{ mr: 0.5, mb: "-3px" }}
                        />
                        Pending
                      </span>
                    ) : (
                      "Unknown"
                    )}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        )}
        <Divider sx={{ my: 4 }} />
        <Box display="flex" justifyContent="center">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<LoginIcon />}
            onClick={handleLoginClick}
            size="small"
            sx={{
              fontWeight: 500,
              px: 2,
              py: 0.5,
              borderRadius: 2,
              fontSize: 14,
              minWidth: 0,
            }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

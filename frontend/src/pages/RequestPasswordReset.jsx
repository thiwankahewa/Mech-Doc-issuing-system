import React, { useState } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Alert from "@mui/material/Alert";

export default function RequestPasswordReset() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await axios.post(
        "http://localhost:1000/api/auth/request-password-reset",
        { email }
      );
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Error sending reset email.");
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
      <Paper elevation={4} sx={{ p: 4, minWidth: 340, maxWidth: 400 }}>
        <Typography
          variant="h5"
          fontWeight={700}
          color="primary"
          align="center"
          gutterBottom
        >
          Reset Password
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 2 }}
        >
          Enter your admin email to receive a password reset link.
        </Typography>
        <form onSubmit={submit}>
          <Stack spacing={2}>
            <TextField
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              fullWidth
              disabled={loading || success}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !email || success}
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
              sx={{ fontWeight: 600 }}
            >
              {success ? (
                <>
                  <CheckCircleIcon sx={{ mr: 1 }} fontSize="small" />
                  Link Sent
                </>
              ) : (
                "Request Reset Link"
              )}
            </Button>
            {error && <Alert severity="error">{error}</Alert>}
            {success && (
              <Alert severity="success">
                Check your email for the reset link.
              </Alert>
            )}
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

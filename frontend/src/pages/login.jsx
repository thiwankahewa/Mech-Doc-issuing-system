import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import LoginIcon from "@mui/icons-material/Login";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:1000/api/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
      if (onLogin) onLogin();
      navigate("/home", { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Error setting password";
      if (msg === "Password not set.") {
        alert("You need to set your password first.");
        navigate("/setPassword");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const goToSetPassword = () => {
    navigate("/setPassword");
  };

  const goToRequestReset = () => {
    navigate("/requestPasswordReset");
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
          Authorized User Login
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 2 }}
        >
          Please enter your credentials to access the system.
        </Typography>
        <form onSubmit={submit}>
          <Stack spacing={2}>
            <TextField
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              label="Username"
              placeholder="Username"
              required
              fullWidth
              disabled={loading}
              autoFocus
            />
            <TextField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="Password"
              required
              fullWidth
              disabled={loading}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <LoginIcon />
                )
              }
              disabled={loading || !username || !password}
              sx={{ fontWeight: 600 }}
              fullWidth
            >
              Login
            </Button>
            {error && <Alert severity="error">{error}</Alert>}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Button
                variant="text"
                color="primary"
                size="small"
                startIcon={<LockOpenIcon />}
                onClick={goToSetPassword}
              >
                Set Password
              </Button>
              <Link
                component="button"
                variant="body2"
                color="secondary"
                onClick={goToRequestReset}
                underline="hover"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <VpnKeyIcon fontSize="small" sx={{ mr: 0.5 }} />
                Forgot password?
              </Link>
            </Stack>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/")}
              size="small"
              sx={{ mt: 1, fontWeight: 500 }}
              fullWidth
            >
              Go to Verify Page
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

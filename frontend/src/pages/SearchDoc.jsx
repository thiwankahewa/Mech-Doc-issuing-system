import { useState } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Alert from "@mui/material/Alert";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import Divider from "@mui/material/Divider";

export default function SearchDoc() {
  const [filters, setFilters] = useState({
    refNo: "",
    created_by: "",
    recipient: "",
    fromDate: "",
    toDate: "",
  });
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    setSearching(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:1000/api/letterhead/search",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: filters,
        }
      );
      setFilters({
        refNo: "",
        created_by: "",
        recipient: "",
        fromDate: "",
        toDate: "",
      });
      setResults(res.data);
    } catch (err) {
      setError("Search failed");
    } finally {
      setSearching(false);
    }
  };

  const exportCSV = () => {
    const headers = [
      "Ref No",
      "recipient",
      "Created At",
      "Created By",
      "Status",
    ];
    const rows = results.map((row) => [
      row.refNo,
      row.recipient,
      row.createdAt,
      row.createdBy,
      row.signed ? "Signed" : "Pending",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "letterheads_report.csv";
    link.click();
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f5f7fa">
      <Paper elevation={5} sx={{ p: 4, minWidth: 350, maxWidth: 1100, width: "100%" }}>
        <Typography variant="h5" fontWeight={700} color="primary" align="center" gutterBottom>
          Search Issued Letterheads
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2} alignItems="center" justifyContent="center">
          <TextField
            label="Ref. No"
            value={filters.refNo}
            onChange={(e) => {
              let value = e.target.value.replace(/[^0-9]/g, "");
              value = value.slice(0, 9);
              if (value.length > 6) {
                value = value.slice(0, 6) + "-" + value.slice(6);
              }
              setFilters({ ...filters, refNo: value });
            }}
            size="small"
            sx={{ width: 140 }}
            placeholder="REF-XXXXXX-XXX"
          />
          <TextField
            label="Created By"
            value={filters.created_by}
            onChange={(e) => setFilters({ ...filters, created_by: e.target.value })}
            size="small"
            sx={{ width: 140 }}
          />
          <TextField
            label="Recipient"
            value={filters.recipient}
            onChange={(e) => setFilters({ ...filters, recipient: e.target.value })}
            size="small"
            sx={{ width: 140 }}
          />
          <TextField
            label="From"
            type="date"
            value={filters.fromDate}
            onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            size="small"
            sx={{ width: 140 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="To"
            type="date"
            value={filters.toDate}
            onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            size="small"
            sx={{ width: 140 }}
            InputLabelProps={{ shrink: true }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={searching}
            sx={{ fontWeight: 600, minWidth: 110 }}
          >
            {searching ? "Searching..." : "Search"}
          </Button>
          <Button
            variant="outlined"
            color="success"
            startIcon={<DownloadIcon />}
            onClick={exportCSV}
            disabled={!results.length}
            sx={{ fontWeight: 600, minWidth: 110 }}
          >
            Export CSV
          </Button>
        </Stack>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 500 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Ref No</TableCell>
                <TableCell>Recipient</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Preview</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="text.secondary">No results found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                results.map((r, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{r.refNo}</TableCell>
                    <TableCell>{r.recipient}</TableCell>
                    <TableCell>{new Date(r.created_at).toLocaleString()}</TableCell>
                    <TableCell>{r.created_by}</TableCell>
                    <TableCell>
                      {r.signed ? (
                        <span style={{ color: "#388e3c", fontWeight: 600 }}>✅ Signed</span>
                      ) : (
                        <span style={{ color: "#fbc02d", fontWeight: 600 }}>⌛ Pending</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {r.signed ? (
                        <Button
                          href={`http://localhost:1000/signed_letters/${r.signed_file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={<FileOpenIcon />}
                        >
                          Preview
                        </Button>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

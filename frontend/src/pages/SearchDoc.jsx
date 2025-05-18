import { useState } from "react";
import axios from "axios";

export default function SearchDoc() {
  const [filters, setFilters] = useState({
    refNo: "",
    created_by: "",
    recipient: "",
    fromDate: "",
    toDate: "",
  });
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
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
      console.log(res.data);
    } catch (err) {
      alert("Search failed");
    }
  };

  const exportCSV = () => {
    const headers = [
      "Ref No",
      "Reason",
      "recipient",
      "Created At",
      "Created By",
      "Status",
    ];
    const rows = results.map((row) => [
      row.refNo,
      row.reason,
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
    <div>
      <h2>Search Issued Letterheads</h2>
      <input
        placeholder="Ref. No"
        type="text"
        value={filters.refNo}
        onChange={(e) => {
          let value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-digits
          value = value.slice(0, 9); // Limit to 9 digits
          if (value.length > 6) {
            value = value.slice(0, 6) + "-" + value.slice(6);
          }
          setFilters({ ...filters, refNo: value });
        }}
      />

      <input
        placeholder="Created By"
        value={filters.created_by}
        onChange={(e) => setFilters({ ...filters, created_by: e.target.value })}
      />
      <input
        placeholder="Recipient"
        value={filters.recipient}
        onChange={(e) => setFilters({ ...filters, recipient: e.target.value })}
      />
      <input
        type="date"
        onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
      />
      <input
        type="date"
        onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={exportCSV} disabled={!results.length}>
        Export CSV
      </button>

      <table border="1" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Ref No</th>
            <th>Reason</th>
            <th>recipient</th>
            <th>Created At</th>
            <th>Created By</th>
            <th>Status</th>
            <th>Preview</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, idx) => (
            <tr key={idx}>
              <td>{r.refNo}</td>
              <td>{r.reason}</td>
              <td>{r.recipient}</td>
              <td>{new Date(r.created_at).toLocaleString()}</td>
              <td>{r.created_by}</td>
              <td>{r.signed ? "✅ Signed" : "⌛ Pending"}</td>
              <td>
                {r.signed ? (
                  <a
                    href={`http://localhost:1000/signed_letters/${r.signed_file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Preview Signed File
                  </a>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

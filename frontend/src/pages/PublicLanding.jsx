import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PublicLanding() {
  const [refNo, setRefNo] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!refNo.trim()) return alert("Please enter a reference number.");

    try {
      const res = await axios.get(
        `http://localhost:1000/api/verify?refNo=${refNo}`
      );
      setData(res.data);
      setError("");
    } catch (err) {
      setData(null);
      setError(err.response?.data?.message || "Error verifying letterhead");
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
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>Verify Letterhead</h2>
      <div style={{ marginBottom: "15px" }}>
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
          style={{ width: "70%", padding: "8px", marginRight: "10px" }}
        />
        <button onClick={handleSearch}>Verify</button>
      </div>

      {error && <h4 style={{ color: "red" }}>{error}</h4>}
      {data && (
        <div>
          <p>
            <strong>Reference No:</strong> {data.refNo}
          </p>
          <p>
            <strong>Reason:</strong> {data.reason}
          </p>
          <p>
            <strong>Person/Organization:</strong> {data.recipient}
          </p>
          <p>
            <strong>Signed At:</strong>{" "}
            {data.signed_at ? new Date(data.signed_at).toLocaleString() : "-"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {data.signed === 1
              ? "✅ Signed"
              : data.signed === 0
              ? "⌛ Pending"
              : "Unknown"}
          </p>
          {data.signedFileURL && (
            <p>
              <a
                href={`http://localhost:1000${data.signedFileURL}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Signed Document
              </a>
            </p>
          )}
        </div>
      )}

      <hr />
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleLoginClick}>Login</button>
      </div>
    </div>
  );
}

import { useState } from "react";
import axios from "axios";

export default function GenerateLH() {
  const [reason, setReason] = useState("");
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);
  const [refNo, setRefNo] = useState(null);
  const [fileUrl, setFileUrl] = useState("");

  const token = localStorage.getItem("token");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRefNo(null);
    try {
      const res = await axios.post(
        "http://localhost:1000/api/letterhead/generate",
        { reason, recipient },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRefNo(res.data.refNo);
      setFileUrl(res.data.downloadUrl); // URL to download generated Word file
    } catch (err) {
      alert(err.response?.data?.message || "Failed to generate letterhead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Generate New Letterhead</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block font-semibold">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-semibold">
            To (Person / Organization)
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Generating..." : "Generate Letterhead"}
        </button>
      </form>

      {refNo && (
        <div className="mt-6 p-4 border rounded bg-green-50">
          <p>
            <strong>Reference No:</strong> {refNo}
          </p>
          <a
            href={fileUrl}
            className="text-blue-600 underline mt-2 inline-block"
            download
          >
            📄 Download Letterhead
          </a>
        </div>
      )}
    </div>
  );
}

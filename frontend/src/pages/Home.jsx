import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">
          Department Letterhead System
        </h1>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded shadow hover:bg-blue-600 transition"
            onClick={() => navigate("/generateLH")}
          >
            📝 Generate New Letterhead
          </button>
          <button
            className="bg-green-500 text-white px-6 py-3 rounded shadow hover:bg-green-600 transition"
            onClick={() => navigate("/upload-signed")}
          >
            📤 Upload Signed Letter
          </button>
          <button
            className="bg-yellow-500 text-white px-6 py-3 rounded shadow hover:bg-yellow-600 transition"
            onClick={() => navigate("/search-doc")}
          >
            🔍 Search Issued Letters
          </button>
        </div>
      </div>
      <div>
        <h2>Welcome! You are logged in.</h2>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

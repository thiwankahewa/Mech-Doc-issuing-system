import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import SetPassword from "./pages/SetPassword";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import RequestPasswordReset from "./pages/RequestPasswordReset";
import ResetPassword from "./pages/ResetPassword";
import GenerateLH from "./pages/GenerateLH";
import UploadSignedLetter from "./pages/UploadSignedLetter";
import SearchDoc from "./pages/SearchDoc";
import PublicLanding from "./pages/PublicLanding";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setPassword" element={<SetPassword />} />
        <Route
          path="/requestPasswordReset"
          element={<RequestPasswordReset />}
        />
        <Route path="/resetPassword" element={<ResetPassword />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/generateLH"
          element={
            <ProtectedRoute>
              <GenerateLH />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-signed"
          element={
            <ProtectedRoute>
              <UploadSignedLetter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search-doc"
          element={
            <ProtectedRoute>
              <SearchDoc />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import SetPassword from "./pages/SetPassword";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import RequestPasswordReset from "./pages/RequestPasswordReset";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/setPassword" element={<SetPassword />} />
        <Route
          path="/requestPasswordReset"
          element={<RequestPasswordReset />}
        />
        <Route path="/resetPassword" element={<ResetPassword />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

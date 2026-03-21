import { Routes, Route } from "react-router-dom";
import Authentication from "./Authentication.jsx";
import ForgetPassword from "./ForgetPassword.jsx";
import ResetPassword from "./ResetPassword.jsx";
import Dashboard from "./Dashboard.jsx";
import NotFound from "./NotFound.jsx";
import Unauthorized from "./Unauthorized.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

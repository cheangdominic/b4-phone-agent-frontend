import { Routes, Route } from "react-router-dom";
import Authentication from "./Authentication.jsx";
import ForgetPassword from "./ForgetPassword.jsx";
import ResetPassword from "./ResetPassword.jsx";
import NotFound from "./NotFound.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Authentication />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

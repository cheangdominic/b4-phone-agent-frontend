import { Routes, Route } from "react-router-dom";
import Authentication from "./Authentication.jsx";
import ForgetPassword from "./ForgetPassword.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Authentication />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/forgot-password" element={<ForgetPassword />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </div>
  );
}

export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import Authentication from "./Authentication.jsx";
import ForgetPassword from "./ForgetPassword.jsx";
import ResetPassword from "./ResetPassword.jsx";
import Dashboard from "./Dashboard.jsx";
import NotFound from "./NotFound.jsx";
import Unauthorized from "./Unauthorized.jsx";
import './App.css';
import { useState } from 'react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  }
 
  return (
    <div>
      <Routes>
        {/* Logged in dashboard */}
        <Route 
          path="/" 
          element={token ? <Navigate to="/dashboard" /> : <Authentication setToken={setToken} />} 
        />

        {/* Protected route (need token) */}
        <Route 
          path="/dashboard" 
          element={token ? <Dashboard token={token} handleLogout={handleLogout} /> : <Navigate to="/" />} 
        />

        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

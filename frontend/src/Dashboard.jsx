import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AdminPanel from "./AdminPanel";
import UserPanel from "./UserPanel";

function Dashboard({ token, handleLogout }) {
  const [isAdmin, setIsAdmin] = useState(null);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {

    if (!token) {
      navigate("/unauthorized");
      return;
    }

    const fetchSecureData = async () => {
      try {
        const res = await fetch("http://localhost:3000/my-dashboard", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Invalid or expired token");
        }

        const data = await res.json();

        setEmail(data.email);
        setIsAdmin(data.is_admin === 1 || data.is_admin === true);

      } catch (err) {
        console.error("Security caught a bad token:", err);
        handleLogout();
        navigate("/unauthorized");
      }
    };

    fetchSecureData();
  }, [token, navigate, handleLogout]);


  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow border border-slate-200 p-6 mb-6 flex items-center justify-between">
          <div>
            {isAdmin ? (
              <h1 className="text-3xl font-bold text-slate-800">
                Admin Dashboard
              </h1>
            ) : (
              <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            )}
            <p className="text-slate-500 mt-1">Welcome back, {email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm cursor-pointer"
          >
            Logout
          </button>
        </div>

        {isAdmin ? <AdminPanel /> : <UserPanel email={email} />}
      </motion.div>
    </div>
  );
}

export default Dashboard;

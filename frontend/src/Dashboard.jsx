import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AdminPanel from "./AdminPanel";
import UserPanel from "./UserPanel";

function Dashboard() {
  const [isAdmin, setIsAdmin] = useState(null);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");

    if (!storedEmail) {
      navigate("/Unauthorized");
      return;
    }

    setEmail(storedEmail);

    const checkAdmin = async () => {
      try {
        const res = await fetch(
          `https://valleybalfour.dev/b4backend/is-admin?email=${storedEmail}`,
        );
        const data = await res.json();
        setIsAdmin(data.admin);
      } catch (err) {
        console.error(err);
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

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
            onClick={() => {
              localStorage.removeItem("email");
              window.location.href = "/";
            }}
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

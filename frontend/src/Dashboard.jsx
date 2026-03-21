import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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

    if (!storedEmail) {
      setIsAdmin(false);
      return;
    }

    setEmail(storedEmail);

    const checkAdmin = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/is-admin?email=${storedEmail}`,
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

        {isAdmin && <AdminPanel />}
      </motion.div>
    </div>
  );
}

function AdminPanel() {
  const [usage, setUsage] = useState(null);

//   useEffect(() => {
//     const fetchUsage = async () => {
//       try {
//         const res = await fetch("http://localhost:3000/api-usage");
//         const data = await res.json();
//         setUsage(data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchUsage();
//   }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid md:grid-cols-2 gap-6"
    >
      <Card
        title="Total API Calls"
        value={usage ? usage.total : "Loading..."}
      />
      <Card
        title="Today's API Calls"
        value={usage ? usage.today : "Loading..."}
      />
    </motion.div>
  );
}

function Card({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
    >
      <h3 className="text-sm text-slate-500">{title}</h3>
      <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
    </motion.div>
  );
}

export default Dashboard;

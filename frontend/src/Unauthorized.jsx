import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-100 overflow-hidden px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1 }}
        className="absolute w-[500px] h-[500px] bg-blue-500 rounded-full blur-3xl"
      />

      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: [0, -10, 0] }}
        transition={{
          opacity: { duration: 0.3 },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
        className="text-6xl md:text-7xl font-bold text-slate-800 tracking-tight mb-6 relative z-10"
      >
        Access Denied
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 max-w-md w-full text-center relative z-10"
      >
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-slate-800 mb-2"
        >
          You must be logged in
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-slate-500 text-sm mb-6"
        >
          To access this page, please log in with your account.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/")}
          className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold shadow-sm"
        >
          Go to Login
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Unauthorized;

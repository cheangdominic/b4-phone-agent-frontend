import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const backendBase = "https://valleybalfour.dev/b4backend";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${backendBase}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Password reset email sent!");
        navigate("/");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="text-4xl md:text-5xl font-bold mb-8 text-slate-800 tracking-tight"
      >
        B4 Phone Agent
      </motion.h1>

      <div className="w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800">
                Forgot Password
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Enter your email to receive a reset link
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold shadow-sm"
              >
                Send Reset Link
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default ForgetPassword;

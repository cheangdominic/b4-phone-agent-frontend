import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Authentication({ setToken }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin
      ? "http://localhost:3000/login"
      : "http://localhost:3000/signup";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);

        if (!isLogin) {
          setIsLogin(true);
        } else {
          setToken(data.token);
          localStorage.setItem("token", data.token);
          localStorage.setItem("email", form.email);
          navigate("/dashboard");
        }
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
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-bold mb-8 text-slate-800 tracking-tight"
      >
        B4 Phone Agent
      </motion.h1>

      <div className="w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
        >
          <div className="relative mb-8 bg-slate-100 rounded-lg p-1">
            <div className="relative flex">
              <button
                onClick={() => setIsLogin(true)}
                className={`relative z-10 w-1/2 py-2.5 text-sm font-semibold transition-colors duration-150 ${
                  isLogin ? "text-white" : "text-slate-600 cursor-pointer"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`relative z-10 w-1/2 py-2.5 text-sm font-semibold transition-colors duration-150 ${
                  !isLogin ? "text-white" : "text-slate-600 cursor-pointer"
                }`}
              >
                Sign Up
              </button>
              <motion.div
                className="absolute top-0 left-0 w-1/2 h-full bg-blue-600 rounded-lg"
                layout
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 40,
                  duration: 0.15,
                }}
                initial={false}
                animate={{ x: isLogin ? "0%" : "100%" }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-800">
                    Welcome Back
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Sign in to continue
                  </p>
                </div>
                <div className="space-y-4">
                  <input
                    name="email"
                    type="text"
                    placeholder="Email address"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="text-sm cursor-pointer text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold shadow-sm"
                  >
                    Sign In
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-800">
                    Create Account
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Join us to get started
                  </p>
                </div>
                <div className="space-y-4">
                  <input
                    name="email"
                    type="text"
                    placeholder="Email address"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                  <input
                    name="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                  <button
                    type="submit"
                    className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold shadow-sm"
                  >
                    Create Account
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default Authentication;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
      {/* Title Section - Solid color, no gradient */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-bold mb-8 text-slate-800 tracking-tight"
      >
        B4 Phone Agent
      </motion.h1>

      <div className="w-full max-w-md px-4">
        {/* Card Container - Solid white, no blur, simple shadow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
        >
          {/* Slider Toggle - Solid colors, no gradients */}
          <div className="relative mb-8 bg-slate-100 rounded-lg p-1">
            <div className="relative flex">
              <button
                onClick={() => setIsLogin(true)}
                className={`relative z-10 w-1/2 py-2.5 text-sm font-semibold transition-colors duration-150 ${
                  isLogin ? "text-white" : "text-slate-600"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`relative z-10 w-1/2 py-2.5 text-sm font-semibold transition-colors duration-150 ${
                  !isLogin ? "text-white" : "text-slate-600"
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
              <motion.div
                key="login"
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
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                      Forgot password?
                    </button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.1 }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
                  >
                    Sign In
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
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
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Create a strong password"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.1 }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
                  >
                    Create Account
                  </motion.button>

                  <p className="text-xs text-center text-slate-500 pt-2">
                    By signing up, you agree to our Terms of Service and Privacy
                    Policy
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default App;

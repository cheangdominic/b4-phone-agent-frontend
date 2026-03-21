import React from 'react'
import { motion } from "framer-motion";

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

export default Card

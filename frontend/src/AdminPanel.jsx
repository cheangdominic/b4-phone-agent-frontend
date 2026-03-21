import React, { useState } from "react";
import Card from "./templates/Card";
import { motion } from "framer-motion";

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
export default AdminPanel;

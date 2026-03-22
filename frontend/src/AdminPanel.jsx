import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  GripVertical,
  TrendingUp,
  Users,
  Phone,
  Activity,
  RefreshCw,
} from "lucide-react";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [cards, setCards] = useState([]);
  const [draggedCard, setDraggedCard] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const usageData = [
    { day: "Mon", calls: 30 },
    { day: "Tue", calls: 45 },
    { day: "Wed", calls: 60 },
    { day: "Thu", calls: 40 },
    { day: "Fri", calls: 80 },
  ];

  const userData = [
    { name: "A", calls: 10 },
    { name: "B", calls: 25 },
    { name: "C", calls: 15 },
  ];

  const pieData = [
    { name: "Success", value: 80, color: "#10b981" },
    { name: "Failed", value: 20, color: "#ef4444" },
  ];

  useEffect(() => {
    setUsers([
      { id: 1, email: "test1@gmail.com", apiCallsUsed: 12, active: true },
      { id: 2, email: "test2@gmail.com", apiCallsUsed: 5, active: false },
      { id: 3, email: "test3@gmail.com", apiCallsUsed: 23, active: true },
    ]);

    // Initialize cards with their content
    setCards([
      {
        id: "stats-1",
        type: "stat",
        title: "Total Calls",
        value: "245",
        icon: "Phone",
        trend: "+12%",
        color: "blue",
      },
      {
        id: "stats-2",
        type: "stat",
        title: "Today's Calls",
        value: "32",
        icon: "Activity",
        trend: "+5%",
        color: "green",
      },
      {
        id: "stats-3",
        type: "stat",
        title: "Avg Call Time",
        value: "2.4m",
        icon: "Clock",
        trend: "-8%",
        color: "purple",
      },
      {
        id: "stats-4",
        type: "stat",
        title: "Latency",
        value: "120ms",
        icon: "TrendingUp",
        trend: "-15%",
        color: "orange",
      },
      {
        id: "line-chart",
        type: "lineChart",
        title: "API Usage Trend",
        colSpan: "col-span-2",
      },
      {
        id: "bar-chart",
        type: "barChart",
        title: "Calls per User",
        colSpan: "col-span-2",
      },
      { id: "pie-chart", type: "pieChart", title: "Success Rate" },
      { id: "mini-stats", type: "miniStats", title: "System Status" },
      {
        id: "users-table",
        type: "usersTable",
        title: "Users",
        colSpan: "col-span-4",
      },
    ]);
  }, []);

  const handleDragStart = (e, index) => {
    setDraggedCard(index);
    e.dataTransfer.effectAllowed = "move";
    e.target.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "";
    setDraggedCard(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedCard === null) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedCard === null) return;

    const newCards = [...cards];
    const [removed] = newCards.splice(draggedCard, 1);
    newCards.splice(dropIndex, 0, removed);
    setCards(newCards);
    setDraggedCard(null);
    setDragOverIndex(null);
  };

  const getIcon = (iconName) => {
    const icons = {
      Phone: <Phone size={20} />,
      Activity: <Activity size={20} />,
      TrendingUp: <TrendingUp size={20} />,
    };
    return icons[iconName] || <Activity size={20} />;
  };

  const renderCard = (card, index) => {
    const isDragOver = dragOverIndex === index;

    const cardContent = () => {
      switch (card.type) {
        case "stat":
          const colorClasses = {
            blue: "from-blue-500 to-blue-600",
            green: "from-green-500 to-green-600",
            purple: "from-purple-500 to-purple-600",
            orange: "from-orange-500 to-orange-600",
          };
          return (
            <div className="relative overflow-hidden">
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[card.color]} opacity-10 rounded-full transform translate-x-16 -translate-y-8`}
              />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-slate-800">
                    {card.value}
                  </p>
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <TrendingUp size={12} />
                    {card.trend}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[card.color]} text-white shadow-lg`}
                >
                  {getIcon(card.icon)}
                </div>
              </div>
            </div>
          );

        case "lineChart":
          return (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  {card.title}
                </h2>
                <button className="text-slate-400 hover:text-slate-600 transition">
                  <RefreshCw size={16} />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={usageData}>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="calls"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </>
          );

        case "barChart":
          return (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  {card.title}
                </h2>
                <button className="text-slate-400 hover:text-slate-600 transition">
                  <RefreshCw size={16} />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={userData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="calls" radius={[8, 8, 0, 0]} fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </>
          );

        case "pieChart":
          return (
            <>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                {card.title}
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {pieData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-slate-600">
                      {item.name}: {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          );

        case "miniStats":
          return (
            <>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                {card.title}
              </h2>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Active Calls</p>
                  <p className="text-2xl font-bold text-slate-800">7</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">AI Confidence</p>
                  <p className="text-2xl font-bold text-slate-800">92%</p>
                  <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: "92%" }}
                    />
                  </div>
                </div>
              </div>
            </>
          );

        case "usersTable":
          return (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-800">
                  {card.title}
                </h2>
                <button className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                  Manage Users
                </button>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">
                        Email
                      </th>
                      <th className="text-left px-4 py-3 font-semibold">
                        Calls
                      </th>
                      <th className="text-left px-4 py-3 font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr
                        key={u.id}
                        className="border-t hover:bg-slate-50 transition"
                      >
                        <td className="px-4 py-3 text-slate-700">{u.email}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {u.apiCallsUsed}
                            </span>
                            <div className="flex-1 max-w-[100px] bg-slate-100 rounded-full h-1.5">
                              <div
                                className="bg-blue-500 h-1.5 rounded-full"
                                style={{
                                  width: `${(u.apiCallsUsed / 50) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              u.active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {u.active ? "Active" : "Suspended"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          );

        default:
          return null;
      }
    };

    return (
      <motion.div
        key={card.id}
        draggable
        onDragStart={(e) => handleDragStart(e, index)}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => handleDragOver(e, index)}
        onDrop={(e) => handleDrop(e, index)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`${card.colSpan || "col-span-1"} relative`}
      >
        <div
          className={`
            bg-white rounded-2xl shadow-sm border transition-all duration-200
            ${isDragOver ? "border-blue-400 shadow-lg ring-2 ring-blue-200 scale-[1.02]" : "border-slate-200"}
            ${draggedCard === index ? "opacity-50" : "hover:shadow-md"}
          `}
        >
          <div
            className="absolute top-3 left-3 cursor-grab active:cursor-grabbing p-1 hover:bg-slate-100 rounded-lg transition opacity-0 group-hover:opacity-100"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <GripVertical size={16} className="text-slate-400" />
          </div>

          <div className="p-5 group relative">{cardContent()}</div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-8"
    >
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm">
            <GripVertical size={14} />
            <span>Drag and drop cards to reorder</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 auto-rows-[minmax(120px,auto)]">
        <AnimatePresence>
          {cards.map((card, index) => renderCard(card, index))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default AdminPanel;

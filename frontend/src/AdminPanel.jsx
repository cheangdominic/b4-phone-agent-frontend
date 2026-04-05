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
  AreaChart,
  Area,
} from "recharts";
import {
  GripVertical,
  TrendingUp,
  Phone,
  Activity,
  RefreshCw,
  MessageSquare,
  Users,
  Clock,
  Award,
  Zap,
  Calendar,
  Mail,
  Server,
  AlertCircle,
} from "lucide-react";

const BASE_URL = "http://localhost:3000";

function AdminPanel() {
  const [cards, setCards] = useState([]);
  const [draggedCard, setDraggedCard] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [stats, setStats] = useState({});
  const [usageData, setUsageData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [convStats, setConvStats] = useState({});
  const [dailyMessages, setDailyMessages] = useState([]);
  const [hourlyDist, setHourlyDist] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [messageRatio, setMessageRatio] = useState([{ name: "User", value: 0 }, { name: "AI", value: 0 }]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, usageRes, userRes, convStatsRes, dailyMsgRes, hourlyRes, topUsersRes, recentRes, userActivityRes] = await Promise.all([
        fetch(`${BASE_URL}/admin/stats`, { headers }),
        fetch(`${BASE_URL}/admin/usage-trend`, { headers }),
        fetch(`${BASE_URL}/admin/user-calls`, { headers }),
        fetch(`${BASE_URL}/admin/conversation-stats`, { headers }),
        fetch(`${BASE_URL}/admin/daily-messages`, { headers }),
        fetch(`${BASE_URL}/admin/hourly-distribution`, { headers }),
        fetch(`${BASE_URL}/admin/top-users`, { headers }),
        fetch(`${BASE_URL}/admin/recent-activity`, { headers }),
        fetch(`${BASE_URL}/admin/user-activity`, { headers })
      ]);

      const statsData = await statsRes.json();
      const usage = await usageRes.json();
      const userCalls = await userRes.json();
      const convStatsData = await convStatsRes.json();
      const dailyMsgData = await dailyMsgRes.json();
      const hourlyData = await hourlyRes.json();
      const topUsersData = await topUsersRes.json();
      const recentData = await recentRes.json();
      const userActivityData = await userActivityRes.json();

      setStats(statsData || {});
      setUsageData(Array.isArray(usage) ? usage : []);
      setUserData(Array.isArray(userCalls) ? userCalls : []);
      setConvStats(convStatsData || {});
      setDailyMessages(Array.isArray(dailyMsgData) ? dailyMsgData : []);
      setHourlyDist(Array.isArray(hourlyData) ? hourlyData : []);
      setTopUsers(Array.isArray(topUsersData) ? topUsersData : []);
      setRecentActivity(Array.isArray(recentData) ? recentData : []);
      setUserActivity(Array.isArray(userActivityData) ? userActivityData : []);
      
      if (convStatsData.userMessages && convStatsData.aiMessages) {
        setMessageRatio([
          { name: "User Messages", value: convStatsData.userMessages },
          { name: "AI Messages", value: convStatsData.aiMessages }
        ]);
      }
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

useEffect(() => {
  setCards([
    { id: "stats-1", type: "stat", title: "Total Calls", icon: "Phone", color: "blue", value: stats.totalCalls || 0, colSpan: "col-span-1" },
    { id: "stats-2", type: "stat", title: "Today's Calls", icon: "Activity", color: "green", value: stats.todayCalls || 0, colSpan: "col-span-1" },
    { id: "stats-3", type: "stat", title: "Avg Calls/User", icon: "TrendingUp", color: "purple", value: stats.avgCalls || 0, colSpan: "col-span-1" },
    { id: "stats-4", type: "stat", title: "Total Messages", icon: "MessageSquare", color: "orange", value: convStats.totalMessages || 0, colSpan: "col-span-1" },
    
    { id: "line-chart", type: "lineChart", title: "API Usage Trend (Last 7 Days)", colSpan: "col-span-2" },
    { id: "hourly-chart", type: "hourlyChart", title: "Calls Distribution by Hour", colSpan: "col-span-2" },
    
    { id: "stats-5", type: "stat", title: "Active Users", icon: "Users", color: "pink", value: userActivity.length, colSpan: "col-span-1" },
    { id: "stats-6", type: "stat", title: "Avg Msg/Call", icon: "MessageSquare", color: "teal", value: convStats.avgMessagesPerCall || 0, colSpan: "col-span-1" },
    { id: "pie-chart", type: "pieChart", title: "User vs AI Messages", colSpan: "col-span-2" },
    
    { id: "message-chart", type: "messageChart", title: "Daily Messages Breakdown", colSpan: "col-span-2" },
    { id: "bar-chart", type: "barChart", title: "Top 5 Users by Calls", colSpan: "col-span-2" },
    
    { id: "conv-stats", type: "convStats", title: "Conversation Analytics", colSpan: "col-span-2" },
    { id: "activity-table", type: "activityTable", title: "Recent Activity (Last 10 Calls)", colSpan: "col-span-2" },
    
    { id: "users-table", type: "usersTable", title: "Complete User Activity Report", colSpan: "col-span-4" }
  ]);
}, [stats, convStats, userActivity, userData]);

  const getIcon = (iconName) => {
    const icons = {
      Phone: <Phone size={20} />,
      Activity: <Activity size={20} />,
      TrendingUp: <TrendingUp size={20} />,
      MessageSquare: <MessageSquare size={20} />,
      Users: <Users size={20} />,
    };
    return icons[iconName] || <Activity size={20} />;
  };

  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    pink: "from-pink-500 to-pink-600",
    teal: "from-teal-500 to-teal-600",
  };

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

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

  const renderCard = (card, index) => {
    const isDragOver = dragOverIndex === index;

    const cardContent = () => {
      switch (card.type) {
        case "stat":
          return (
            <div className="relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[card.color]} opacity-10 rounded-full transform translate-x-16 -translate-y-8`} />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.title}</p>
                  <p className="text-3xl font-bold text-slate-800">
                    {loading ? "..." : card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[card.color]} text-white shadow-md`}>
                  {getIcon(card.icon)}
                </div>
              </div>
            </div>
          );

        case "lineChart":
          return (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800">{card.title}</h2>
                <button onClick={fetchData} className="text-slate-400 hover:text-slate-600 transition">
                  <RefreshCw size={16} />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={usageData}>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                  <Line type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6" }} />
                </LineChart>
              </ResponsiveContainer>
            </>
          );

        case "areaChart":
          return (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800">{card.title}</h2>
                <button onClick={fetchData} className="text-slate-400 hover:text-slate-600 transition">
                  <RefreshCw size={16} />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={dailyMessages}>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                  <Area type="monotone" dataKey="userMessages" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="User Messages" />
                  <Area type="monotone" dataKey="aiMessages" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="AI Messages" />
                </AreaChart>
              </ResponsiveContainer>
            </>
          );

        case "pieChart":
          return (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800">{card.title}</h2>
                <button onClick={fetchData} className="text-slate-400 hover:text-slate-600 transition">
                  <RefreshCw size={16} />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={messageRatio} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {messageRatio.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {messageRatio.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                    <span className="text-xs text-slate-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </>
          );

        case "hourlyChart":
          return (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800">{card.title}</h2>
                <button onClick={fetchData} className="text-slate-400 hover:text-slate-600 transition">
                  <RefreshCw size={16} />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={hourlyDist}>
                  <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} angle={-45} textAnchor="end" height={60} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                  <Bar dataKey="calls" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </>
          );

        case "barChart":
          return (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800">{card.title}</h2>
                <button onClick={fetchData} className="text-slate-400 hover:text-slate-600 transition">
                  <RefreshCw size={16} />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topUsers.slice(0, 5)} layout="vertical">
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                  <YAxis type="category" dataKey="email" stroke="#94a3b8" fontSize={12} width={100} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                  <Bar dataKey="total_calls" fill="#f59e0b" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </>
          );

        case "messageChart":
          return (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800">{card.title}</h2>
                <button onClick={fetchData} className="text-slate-400 hover:text-slate-600 transition">
                  <RefreshCw size={16} />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={dailyMessages}>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                  <Bar dataKey="userMessages" name="User Messages" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="aiMessages" name="AI Messages" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </>
          );

        case "convStats":
          return (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800">{card.title}</h2>
                <button onClick={fetchData} className="text-slate-400 hover:text-slate-600 transition">
                  <RefreshCw size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                  <p className="text-sm text-blue-600 font-medium">Total Messages</p>
                  <p className="text-2xl font-bold text-blue-700">{convStats.totalMessages || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                  <p className="text-sm text-green-600 font-medium">Avg Messages/Call</p>
                  <p className="text-2xl font-bold text-green-700">{convStats.avgMessagesPerCall || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                  <p className="text-sm text-purple-600 font-medium">User Messages</p>
                  <p className="text-2xl font-bold text-purple-700">{convStats.userMessages || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
                  <p className="text-sm text-orange-600 font-medium">AI Messages</p>
                  <p className="text-2xl font-bold text-orange-700">{convStats.aiMessages || 0}</p>
                </div>
              </div>
            </>
          );

        case "activityTable":
          return (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800">{card.title}</h2>
                <button onClick={fetchData} className="text-slate-400 hover:text-slate-600 transition">
                  <RefreshCw size={16} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 text-slate-600">
                    <tr>
                      <th className="px-3 py-2 text-left rounded-l-lg">Email</th>
                      <th className="px-3 py-2 text-left">Started</th>
                      <th className="px-3 py-2 text-left rounded-r-lg">Messages</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.slice(0, 5).map((activity, idx) => (
                      <tr key={activity.call_id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                        <td className="px-3 py-2 text-slate-700 truncate max-w-[150px]">{activity.email}</td>
                        <td className="px-3 py-2 text-xs text-slate-500">{new Date(activity.started_at).toLocaleString()}</td>
                        <td className="px-3 py-2 font-semibold text-slate-700">{activity.message_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          );

        case "usersTable":
          return (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800">{card.title}</h2>
                <button onClick={fetchData} className="text-slate-400 hover:text-slate-600 transition">
                  <RefreshCw size={16} />
                </button>
              </div>
              <div className="overflow-x-auto rounded-xl">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 text-left rounded-l-lg">Email</th>
                      <th className="px-4 py-3 text-left">API Calls</th>
                      <th className="px-4 py-3 text-left">Unique Calls</th>
                      <th className="px-4 py-3 text-left rounded-r-lg">Total Messages</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userActivity.map((user, idx) => (
                      <tr key={idx} className="border-t border-slate-100 hover:bg-slate-50 transition">
                        <td className="px-4 py-3 text-slate-700">{user.email}</td>
                        <td className="px-4 py-3 font-medium text-slate-700">{user.api_calls || 0}</td>
                        <td className="px-4 py-3 text-slate-600">{user.unique_calls || 0}</td>
                        <td className="px-4 py-3 text-slate-600">{user.total_messages || 0}</td>
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
        <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl p-5 transition-all duration-300 ${isDragOver ? "scale-[1.02] ring-2 ring-blue-400" : ""}`}>
          <div className="absolute top-3 left-3 text-slate-300 cursor-grab hover:text-slate-400 transition">
            <GripVertical size={16} />
          </div>
          {cardContent()}
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Statistics
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-full shadow-md">
            <GripVertical size={14} />
            Drag and drop cards
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-white px-3 py-2 rounded-full shadow-md">
            <Clock size={12} />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md text-slate-600 hover:shadow-lg transition"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {loading && Object.keys(stats).length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500">Loading dashboard data...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {cards.map((card, index) => renderCard(card, index))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

export default AdminPanel;
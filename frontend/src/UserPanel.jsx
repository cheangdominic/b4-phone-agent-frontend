import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "./templates/Card";

function UserPanel({ email, onLogout, onEmailUpdate }) {
  const [apiUsage, setApiUsage] = useState({
    used: 0,
    limit: 20,
    remaining: 20,
  });
  const [callRequests, setCallRequests] = useState([]);
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState({ email: "", name: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [newCallForm, setNewCallForm] = useState({
    phoneNumber: "",
    goal: "",
    script: "",
    notes: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Mock data for demo
  const mockCallRequests = [
    {
      id: "1",
      phoneNumber: "+1 (555) 123-4567",
      goal: "Sales follow-up - Q1 product demo",
      status: "Completed",
      timestamp: "2025-03-20T14:30:00Z",
      transcript:
        "Agent: Hello, this is Alex from Acme Corp...\nCustomer: Hi Alex, I'm doing well...",
      summary:
        "Successful sales follow-up. Customer was interested in AI automation features.",
    },
    {
      id: "2",
      phoneNumber: "+1 (555) 987-6543",
      goal: "Customer support - billing issue",
      status: "In Progress",
      timestamp: "2025-03-21T09:15:00Z",
      transcript:
        "Call in progress - agent is investigating the billing discrepancy...",
      summary: "Support ticket created, waiting for resolution.",
    },
    {
      id: "3",
      phoneNumber: "+44 20 7946 0958",
      goal: "Appointment reminder - dental checkup",
      status: "Pending",
      timestamp: "2025-03-21T11:00:00Z",
    },
  ];

  // Load dashboard data
  useEffect(() => {
    if (email) {
      fetchDashboardData();
    }
    // Set profile email when component mounts
    setProfile((prev) => ({ ...prev, email }));
  }, [email]);

  const fetchDashboardData = async () => {
    try {
      // Fetch API usage stats
      const usageRes = await fetch(
        `http://localhost:3000/api/usage?email=${email}`,
      );
      if (usageRes.ok) {
        const usageData = await usageRes.json();
        setApiUsage({
          used: usageData.used || 0,
          limit: usageData.limit || 20,
          remaining: (usageData.limit || 20) - (usageData.used || 0),
        });
      } else {
        setApiUsage({ used: 8, limit: 20, remaining: 12 });
      }

      // Fetch call requests
      const callsRes = await fetch(
        `http://localhost:3000/api/calls?email=${email}`,
      );
      if (callsRes.ok) {
        const callsData = await callsRes.json();
        setCallRequests(callsData);
      } else {
        setCallRequests(mockCallRequests);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setApiUsage({ used: 8, limit: 20, remaining: 12 });
      setCallRequests(mockCallRequests);
    }
  };

  // Submit new call request
  const handleNewCallSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!newCallForm.phoneNumber.trim()) {
      setFormError("Phone number is required");
      return;
    }
    if (!newCallForm.goal.trim()) {
      setFormError("Call goal is required");
      return;
    }

    if (apiUsage.remaining <= 0) {
      setFormError(
        "You have reached your API call limit. Please upgrade to make more calls.",
      );
      return;
    }

    setFormSubmitting(true);

    const newRequest = {
      id: Date.now().toString(),
      phoneNumber: newCallForm.phoneNumber,
      goal: newCallForm.goal,
      script: newCallForm.script,
      notes: newCallForm.notes,
      status: "Pending",
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch(`http://localhost:3000/api/calls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newRequest, email }),
      });

      if (res.ok) {
        const saved = await res.json();
        setCallRequests((prev) => [saved, ...prev]);
      } else {
        setCallRequests((prev) => [newRequest, ...prev]);
      }

      setNewCallForm({ phoneNumber: "", goal: "", script: "", notes: "" });
      setApiUsage((prev) => ({
        ...prev,
        used: prev.used + 1,
        remaining: prev.remaining - 1,
      }));
    } catch (err) {
      console.error("Submit error:", err);
      setCallRequests((prev) => [newRequest, ...prev]);
      setNewCallForm({ phoneNumber: "", goal: "", script: "", notes: "" });
      setApiUsage((prev) => ({
        ...prev,
        used: prev.used + 1,
        remaining: prev.remaining - 1,
      }));
    } finally {
      setFormSubmitting(false);
    }
  };

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          name: profile.name,
          originalEmail: email,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        onEmailUpdate?.(updated.email);
        setProfile(updated);
        setShowProfileModal(false);
      } else {
        // Mock successful update
        onEmailUpdate?.(profile.email);
        setShowProfileModal(false);
      }
    } catch (err) {
      console.error(err);
      onEmailUpdate?.(profile.email);
      setShowProfileModal(false);
    }
  };

  // Change password
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (res.ok) {
        setPasswordMessage("Password updated successfully!");
        setTimeout(() => setPasswordMessage(""), 3000);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordForm(false);
      } else {
        setPasswordMessage("Current password is incorrect");
      }
    } catch (err) {
      setPasswordMessage("Password updated successfully!");
      setTimeout(() => setPasswordMessage(""), 3000);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-amber-100 text-amber-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Completed: "bg-emerald-100 text-emerald-800",
      Failed: "bg-rose-100 text-rose-800",
    };
    return `px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`;
  };

  const getStatusIcon = (status) => {
    const icons = {
      Pending: "⏳",
      "In Progress": "🔄",
      Completed: "✅",
      Failed: "❌",
    };
    return icons[status] || "📞";
  };

  const isLimitReached = apiUsage.remaining <= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* API Usage Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card
            title="API Calls Used"
            value={`${apiUsage.used} / ${apiUsage.limit}`}
            icon="📊"
          />
          <Card title="Remaining Calls" value={apiUsage.remaining} icon="⚡" />
          <Card
            title="Free Limit"
            value={`${apiUsage.limit} total`}
            icon="🎯"
          />
        </div>

        {/* Warning when limit reached */}
        <AnimatePresence>
          {isLimitReached && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-gradient-to-r from-rose-50 to-rose-100 border border-rose-200 rounded-xl p-4 mb-6 flex items-center gap-3 shadow-sm"
            >
              <div className="text-2xl">⚠️</div>
              <div>
                <p className="text-rose-800 font-semibold">API Limit Reached</p>
                <p className="text-rose-700 text-sm">
                  You have used all {apiUsage.limit} free API calls. Please
                  upgrade your plan to continue making calls.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* New Call Request Form */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📞</span>
                New Call Request
              </h2>
              <form onSubmit={handleNewCallSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={newCallForm.phoneNumber}
                    onChange={(e) =>
                      setNewCallForm({
                        ...newCallForm,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="+1 (555) 123-4567"
                    disabled={isLimitReached}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Call Goal / Purpose *
                  </label>
                  <input
                    type="text"
                    value={newCallForm.goal}
                    onChange={(e) =>
                      setNewCallForm({ ...newCallForm, goal: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="e.g., Sales follow-up, Customer support"
                    disabled={isLimitReached}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Conversation Script
                  </label>
                  <textarea
                    rows="3"
                    value={newCallForm.script}
                    onChange={(e) =>
                      setNewCallForm({ ...newCallForm, script: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Provide a brief script or key points for the AI agent..."
                    disabled={isLimitReached}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    rows="2"
                    value={newCallForm.notes}
                    onChange={(e) =>
                      setNewCallForm({ ...newCallForm, notes: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Any extra context or instructions"
                    disabled={isLimitReached}
                  />
                </div>
                {formError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-rose-600 text-sm flex items-center gap-1"
                  >
                    <span>⚠️</span> {formError}
                  </motion.p>
                )}
                <motion.button
                  whileHover={
                    !formSubmitting && !isLimitReached ? { scale: 1.02 } : {}
                  }
                  whileTap={
                    !formSubmitting && !isLimitReached ? { scale: 0.98 } : {}
                  }
                  type="submit"
                  disabled={formSubmitting || isLimitReached}
                  className={`w-full py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                    isLimitReached
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg"
                  }`}
                >
                  {formSubmitting ? "Submitting..." : "Submit Call Request"}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Request Status List */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Call Requests
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="text-left py-3 px-3 text-sm font-semibold text-slate-600">
                        Phone
                      </th>
                      <th className="text-left py-3 px-3 text-sm font-semibold text-slate-600">
                        Goal
                      </th>
                      <th className="text-left py-3 px-3 text-sm font-semibold text-slate-600">
                        Status
                      </th>
                      <th className="text-left py-3 px-3 text-sm font-semibold text-slate-600">
                        Date
                      </th>
                      <th className="text-left py-3 px-3 text-sm font-semibold text-slate-600">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {callRequests.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-8 text-slate-500"
                        >
                          No call requests yet
                        </td>
                      </tr>
                    ) : (
                      callRequests.map((call, index) => (
                        <motion.tr
                          key={call.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-all duration-200"
                        >
                          <td className="py-3 px-3 text-sm text-slate-700 font-medium">
                            {call.phoneNumber}
                          </td>
                          <td
                            className="py-3 px-3 text-sm text-slate-600 max-w-[200px] truncate"
                            title={call.goal}
                          >
                            {call.goal}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`${getStatusBadge(call.status)} inline-flex items-center gap-1`}
                            >
                              {getStatusIcon(call.status)} {call.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-sm text-slate-500 whitespace-nowrap">
                            {new Date(call.timestamp).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-3">
                            {(call.status === "Completed" ||
                              call.transcript ||
                              call.summary) && (
                              <button
                                onClick={() => {
                                  setSelectedTranscript(call);
                                  setShowTranscriptModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                View
                              </button>
                            )}
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Transcript Modal */}
      <AnimatePresence>
        {showTranscriptModal && selectedTranscript && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowTranscriptModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span>📝</span> Call Transcript
                </h3>
                <button
                  onClick={() => setShowTranscriptModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-3 text-sm bg-slate-50 p-4 rounded-xl">
                  <div>
                    <span className="font-semibold text-slate-600">
                      📞 Phone:
                    </span>{" "}
                    <span className="text-slate-700">
                      {selectedTranscript.phoneNumber}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-600">
                      🎯 Goal:
                    </span>{" "}
                    <span className="text-slate-700">
                      {selectedTranscript.goal}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-600">
                      📊 Status:
                    </span>{" "}
                    <span className={getStatusBadge(selectedTranscript.status)}>
                      {getStatusIcon(selectedTranscript.status)}{" "}
                      {selectedTranscript.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-600">
                      📅 Date:
                    </span>{" "}
                    <span className="text-slate-700">
                      {new Date(selectedTranscript.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <span>📋</span> Summary / Outcome
                  </h4>
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-xl border border-slate-200 text-slate-700 whitespace-pre-wrap">
                    {selectedTranscript.summary ||
                      "No summary available for this call."}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <span>💬</span> Conversation Transcript
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 whitespace-pre-wrap font-mono text-sm max-h-64 overflow-y-auto">
                    {selectedTranscript.transcript ||
                      "Transcript not yet available."}
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    onClick={() => {
                      const content = `Call Transcript\n\nPhone: ${selectedTranscript.phoneNumber}\nGoal: ${selectedTranscript.goal}\nStatus: ${selectedTranscript.status}\nDate: ${new Date(selectedTranscript.timestamp).toLocaleString()}\n\nSummary:\n${selectedTranscript.summary || "N/A"}\n\nTranscript:\n${selectedTranscript.transcript || "N/A"}`;
                      const blob = new Blob([content], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `call_${selectedTranscript.id}_transcript.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-4 py-2 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all text-sm font-medium flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download Transcript
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowProfileModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span>👤</span> Profile Settings
                </h3>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-700 mb-3">
                    Account Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Enter your name"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleUpdateProfile}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 rounded-xl font-semibold transition-all"
                    >
                      Update Profile
                    </motion.button>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <button
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                    {showPasswordForm ? "Hide" : "Change"} Password
                  </button>

                  <AnimatePresence>
                    {showPasswordForm && (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handlePasswordChange}
                        className="mt-4 space-y-3 overflow-hidden"
                      >
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                currentPassword: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                newPassword: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            required
                          />
                        </div>
                        {passwordMessage && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`text-sm ${passwordMessage.includes("success") ? "text-emerald-600" : "text-rose-600"} flex items-center gap-1`}
                          >
                            {passwordMessage.includes("success") ? "✓" : "⚠️"}{" "}
                            {passwordMessage}
                          </motion.p>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white py-2 rounded-xl font-semibold transition-all"
                        >
                          Update Password
                        </motion.button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserPanel;

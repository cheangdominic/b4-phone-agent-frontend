import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "./templates/Card";

function UserPanel({ email, onLogout }) {
  const [apiUsage, setApiUsage] = useState({
    used: 0,
    limit: 20,
    remaining: 20,
  });
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [newCallForm, setNewCallForm] = useState({
    phoneNumber: "",
    goal: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const isValidE164 = (number) => /^\+\d{10,15}$/.test(number);

  useEffect(() => {
    if (email) {
      fetchConversations();
      setApiUsage({ used: 5, limit: 20, remaining: 15 });
    }
  }, [email]);

  const fetchConversations = async () => {
    try {
      const mockConversations = [
        {
          id: "1",
          phoneNumber: "+14155551234",
          goal: "Sales follow-up - Q1 product demo",
          status: "Completed",
          timestamp: new Date().toISOString(),
          messages: [
            {
              sender: "user",
              message: "Sales follow-up - Q1 product demo",
              timestamp: new Date(),
            },
            {
              sender: "ai",
              message:
                "Hello! I'm calling about your interest in our Q1 product demo. How are you today?",
              timestamp: new Date(),
            },
            {
              sender: "user",
              message: "I'm good, tell me more",
              timestamp: new Date(),
            },
            {
              sender: "ai",
              message:
                "Great! We have some exciting new features including AI automation and real-time analytics.",
              timestamp: new Date(),
            },
          ],
        },
        {
          id: "2",
          phoneNumber: "+442079460958",
          goal: "Customer support inquiry",
          status: "In Progress",
          timestamp: new Date().toISOString(),
          messages: [
            {
              sender: "user",
              message: "Customer support inquiry",
              timestamp: new Date(),
            },
            {
              sender: "ai",
              message: "Hello! How can I help you today?",
              timestamp: new Date(),
            },
          ],
        },
      ];
      setConversations(mockConversations);
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  };

  const handleNewCallSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!newCallForm.phoneNumber.trim()) {
      setFormError("Phone number is required");
      return;
    }

    if (!isValidE164(newCallForm.phoneNumber)) {
      setFormError("Invalid phone number format. Use format: +14155551234");
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

    try {
      const res = await fetch(`http://localhost:3000/b4backend/call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          goal: newCallForm.goal,
          phoneNumber: newCallForm.phoneNumber,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newConversation = {
          id: data.call_id,
          phoneNumber: newCallForm.phoneNumber,
          goal: newCallForm.goal,
          status: "In Progress",
          timestamp: new Date().toISOString(),
          messages: [
            {
              sender: "user",
              message: newCallForm.goal,
              timestamp: new Date(),
            },
            {
              sender: "ai",
              message: "Call initiated. Connecting...",
              timestamp: new Date(),
            },
          ],
        };
        setConversations((prev) => [newConversation, ...prev]);

        setNewCallForm({ phoneNumber: "", goal: "" });
        setApiUsage((prev) => ({
          ...prev,
          used: prev.used + 1,
          remaining: prev.remaining - 1,
        }));
      } else {
        setFormError("Failed to start call. Please try again.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setFormError("Network error. Please try again.");
    } finally {
      setFormSubmitting(false);
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

  const formatConversationTranscript = (conversation) => {
    if (!conversation.messages) return "No transcript available";
    return conversation.messages
      .map((msg) => `${msg.sender === "user" ? "User" : "AI"}: ${msg.message}`)
      .join("\n\n");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Logout
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card
              title="API Calls Used"
              value={`${apiUsage.used} / ${apiUsage.limit}`}
              icon="📊"
            />
            <Card
              title="Remaining Calls"
              value={apiUsage.remaining}
              icon="⚡"
            />
            <Card
              title="Free Limit"
              value={`${apiUsage.limit} total`}
              icon="🎯"
            />
          </div>

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
                  <p className="text-rose-800 font-semibold">
                    API Limit Reached
                  </p>
                  <p className="text-rose-700 text-sm">
                    You have used all {apiUsage.limit} free API calls. Please
                    upgrade your plan to continue making calls.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      placeholder="+14155551234"
                      disabled={isLimitReached}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Format: + [country code] [number] (10-15 digits total)
                    </p>
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
                    {formSubmitting ? "Initiating Call..." : "Start Call"}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl">💬</span>
                  Conversation History
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
                      {conversations.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="text-center py-8 text-slate-500"
                          >
                            No conversations yet
                          </td>
                        </tr>
                      ) : (
                        conversations.map((conv, index) => (
                          <motion.tr
                            key={conv.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-slate-100 hover:bg-slate-50 transition-all duration-200"
                          >
                            <td className="py-3 px-3 text-sm text-slate-700 font-medium">
                              {conv.phoneNumber}
                            </td>
                            <td
                              className="py-3 px-3 text-sm text-slate-600 max-w-[200px] truncate"
                              title={conv.goal}
                            >
                              {conv.goal}
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`${getStatusBadge(conv.status)} inline-flex items-center gap-1`}
                              >
                                {getStatusIcon(conv.status)} {conv.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-sm text-slate-500 whitespace-nowrap">
                              {new Date(conv.timestamp).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-3">
                              <button
                                onClick={() => {
                                  setSelectedConversation(conv);
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
      </div>

      <AnimatePresence>
        {showTranscriptModal && selectedConversation && (
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
                      {selectedConversation.phoneNumber}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-600">
                      🎯 Goal:
                    </span>{" "}
                    <span className="text-slate-700">
                      {selectedConversation.goal}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-600">
                      📊 Status:
                    </span>{" "}
                    <span
                      className={getStatusBadge(selectedConversation.status)}
                    >
                      {getStatusIcon(selectedConversation.status)}{" "}
                      {selectedConversation.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-600">
                      📅 Date:
                    </span>{" "}
                    <span className="text-slate-700">
                      {new Date(
                        selectedConversation.timestamp,
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <span>💬</span> Conversation
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 whitespace-pre-wrap font-mono text-sm max-h-96 overflow-y-auto">
                    {formatConversationTranscript(selectedConversation)}
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    onClick={() => {
                      const content = `Call Transcript\n\nPhone: ${selectedConversation.phoneNumber}\nGoal: ${selectedConversation.goal}\nStatus: ${selectedConversation.status}\nDate: ${new Date(selectedConversation.timestamp).toLocaleString()}\n\nConversation:\n${formatConversationTranscript(selectedConversation)}`;
                      const blob = new Blob([content], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `call_${selectedConversation.id}_transcript.txt`;
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
    </div>
  );
}

export default UserPanel;

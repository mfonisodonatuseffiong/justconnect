// src/components/MessagesLayout.jsx
import { useState } from "react";
import useMessages from "../hooks/useMessages";
import { motion } from "framer-motion";
import { Send, MessageCircle } from "lucide-react";

const MessagesLayout = ({ role }) => {
  const { conversations, loading, error, sendMessage } = useMessages(role);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  if (loading) return <p className="p-6">Loading messages...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  const handleSend = async () => {
    if (!selectedConversation || !newMessage.trim()) return;
    await sendMessage(selectedConversation.partnerId, newMessage);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6 lg:p-10 flex gap-8">
      {/* Conversations List */}
      <div className="w-1/3 bg-white rounded-2xl shadow-lg p-4">
        <h2 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
          <MessageCircle size={20} /> Conversations
        </h2>
        <ul className="space-y-3">
          {conversations.map((c) => (
            <li
              key={c.id}
              onClick={() => setSelectedConversation(c)}
              className={`p-3 rounded-xl cursor-pointer transition ${
                selectedConversation?.id === c.id
                  ? "bg-gradient-to-r from-orange-400 to-rose-400 text-white"
                  : "hover:bg-orange-100/70"
              }`}
            >
              <p className="font-semibold">{c.partnerName}</p>
              <p className="text-sm truncate">{c.lastMessage || "No messages yet"}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white rounded-2xl shadow-lg flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">
                Chat with {selectedConversation.partnerName}
              </h2>
            </div>

            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              {selectedConversation.messages?.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-xs p-3 rounded-xl ${
                    m.sender === role ? "bg-orange-500 text-white self-end ml-auto" : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {m.text}
                </motion.div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-200 flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded-xl p-3"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 flex items-center gap-2"
              >
                <Send size={18} /> Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesLayout;

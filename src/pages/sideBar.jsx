import {
  MessageSquare,
  Plus,
  User,
  Search,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ConversationContext } from "./AppView.jsx";

export default function ChatSidebar({
  isOpen,
  setIsOpen,
}) {
  const navigate = useNavigate();

  const {
    conversation,
    setConversation,
  } = useContext(ConversationContext);

  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConversations() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const resp = await fetch(
          "/api/conversation/list",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!resp.ok) {
          throw new Error(
            "Failed to fetch conversations"
          );
        }

        const data = await resp.json();

        setConversations(
          data.conversations || []
        );
      } catch (err) {
        console.error(
          "Error fetching conversations:",
          err
        );
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();
  }, []);

  const filteredConversations =
    conversations.filter((chat) =>
      (chat.display_name || chat.title || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div
      className={`
        h-screen bg-zinc-950 text-white border-r border-zinc-800
        flex flex-col transition-all duration-300 ease-in-out
        overflow-hidden
        ${isOpen ? "w-80" : "w-0"}
        ${!isOpen ? "pointer-events-none" : ""}
      `}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          Chats
        </h2>

        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-lg hover:bg-zinc-800"
            onClick={() =>
              navigate("/create-conversation")
            }
          >
            <Plus size={20} />
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-zinc-800"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-4">
        <div className="flex items-center bg-zinc-900 rounded-xl px-3 py-2">
          <Search
            size={18}
            className="text-zinc-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search chats..."
            className="bg-transparent outline-none ml-2 w-full"
          />
        </div>
      </div>

      {/* Chats */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="px-4 py-3 text-zinc-500">
            Loading conversations...
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="px-4 py-3 text-zinc-500">
            No conversations found
          </div>
        ) : (
          filteredConversations.map((chat) => (
            <div
              key={chat.conversation_id}
              onClick={() => {
                setConversation(chat);
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors
                ${
                  conversation?.conversation_id ===
                  chat.conversation_id
                    ? "bg-zinc-800"
                    : "hover:bg-zinc-900"
                }
              `}
            >
              <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
                <MessageSquare size={20} />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">
                  {chat.display_name ||
                    chat.title}
                </h4>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dashboard */}
      <div className="border-t border-zinc-800 p-3">
        <button
          onClick={() =>
            navigate("/dashboard")
          }
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-900"
        >
          <div className="w-10 h-10 rounded-full bg-cyan-700 flex items-center justify-center">
            <User size={18} />
          </div>

          <div className="text-left">
            <p className="font-medium">
              My Dashboard
            </p>
            <p className="text-xs text-zinc-400">
              Profile & settings
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
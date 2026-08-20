import { useContext, useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

import { ConversationContext } from "./AppView.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function generateClientID() {
  return crypto.randomUUID();
}

export default function MessageView() {
  const { messages, conversation, ws } = useContext(ConversationContext);
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!content.trim() || !conversation || !ws) return;

    ws.send(
      JSON.stringify({
        type: "message",
        username: user.username,
        conversation_id: conversation.id,
        content: content.trim(),
        client_id: generateClientID(),
      })
    );

    setContent("");
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="text-zinc-500 text-center mt-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => {
            const isMine = message.sender_id === user.user_id;

            return (
              <div
                key={message.id ?? message.message_id}
                className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
              >
                <div
                  className={`text-xs mb-1 ${
                    isMine ? "text-blue-400" : "text-zinc-500"
                  }`}
                >
                  {message.sender_username}
                </div>

                <div
                  className={`max-w-[70%] p-3 rounded-lg break-words ${
                    isMine ? "bg-blue-600" : "bg-zinc-700"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 p-4 flex gap-2 shrink-0">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 bg-zinc-800 rounded-lg p-3 outline-none w-full"
        />

        <button
          onClick={sendMessage}
          disabled={!content.trim()}
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

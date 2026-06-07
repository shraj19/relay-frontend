import {
  useContext,
  useState,
} from "react";

import { ConversationContext } from "./AppView.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function MessageView() {
  const {
    messages,
    conversation,
    ws,
  } = useContext(ConversationContext);

  const { user } = useAuth();

  const [content, setContent] = useState("");

  const sendMessage = () => {
    if (!content.trim()) return;
    if (!conversation) return;
    if (!ws) return;

    ws.send(
      JSON.stringify({
        type: "message",
        conversation_id:
          conversation.id,
        content,
      })
    );

    setContent("");
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="text-zinc-500 text-center">
            No messages yet.
          </div>
        ) : (
          messages.map((message) => {
  const isMine =
    message.sender_id === user.user_id;

  return (
    <div
      key={message.id ?? message.message_id}
      className={`flex flex-col ${
        isMine ? "items-end" : "items-start"
      }`}
    >
      <div
        className={`text-xs mb-1 ${
          isMine
            ? "text-blue-400"
            : "text-zinc-500"
        }`}
      >
        {message.sender_id}
      </div>

      <div
        className={`max-w-[70%] p-3 rounded-lg ${
          isMine
            ? "bg-blue-600"
            : "bg-zinc-700"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
})
        )}
      </div>

      <div className="border-t border-zinc-800 p-4 flex gap-2">
        <input
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 bg-zinc-800 rounded-lg p-3 outline-none"
        />

        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
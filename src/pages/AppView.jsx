import { useState, useEffect, useRef, useCallback, createContext } from "react";
import { PanelLeft } from "lucide-react";

import ChatSidebar from "./sideBar.jsx";
import MessageView from "./MessageView.jsx";
import { API_BASE_URL, WS_BASE_URL } from "../config.js";

export const ConversationContext = createContext();

export default function AppView() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  const wsRef = useRef(null);
  const previousConversationRef = useRef(null);

  // Create WebSocket connection once
  useEffect(() => {
    const ws = new WebSocket(`${WS_BASE_URL}/api/ws`);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "message") {
          setMessages((prev) => [...prev, data]);
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  // Subscribe/unsubscribe on conversation change
  useEffect(() => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    const previous = previousConversationRef.current;

    if (previous) {
      ws.send(
        JSON.stringify({
          type: "unsubscribe",
          conversation_id: previous.id,
        })
      );
    }

    if (conversation) {
      ws.send(
        JSON.stringify({
          type: "subscribe",
          conversation_id: conversation.id,
        })
      );
    }

    previousConversationRef.current = conversation;
  }, [conversation]);

  // Load conversation history
  useEffect(() => {
    if (!conversation) {
      setMessages([]);
      return;
    }

    let cancelled = false;

    async function fetchMessages() {
      try {
        const resp = await fetch(
          `${API_BASE_URL}/api/conversation/messages?conversation_id=${conversation.id}`,
          { credentials: "include" }
        );

        if (!resp.ok) throw new Error("Failed to fetch messages");

        const data = await resp.json();
        if (!cancelled) {
          setMessages(data.Messages || []);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    }

    fetchMessages();

    return () => {
      cancelled = true;
    };
  }, [conversation]);

  return (
    <ConversationContext.Provider
      value={{
        conversation,
        setConversation,
        messages,
        setMessages,
        ws: wsRef.current,
      }}
    >
      <div className="flex h-screen bg-zinc-900">
        <ChatSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="h-fit mt-4 ml-2 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white"
        >
          <PanelLeft size={20} />
        </button>

        <div className="flex-1 flex flex-col text-white min-h-0">
          {!conversation ? (
            <div className="flex-1 flex items-center justify-center text-zinc-500">
              Select a conversation to start chatting
            </div>
          ) : (
            <>
              <div className="border-b border-zinc-800 p-4 shrink-0">
                <h1 className="text-xl font-semibold">
                  {conversation.display_name || conversation.title}
                </h1>
              </div>
              <MessageView />
            </>
          )}
        </div>
      </div>
    </ConversationContext.Provider>
  );
}

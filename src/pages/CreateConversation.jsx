import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config.js";

function CreateConversation() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [title, setTitle] = useState("");
  const [isGroup, setIsGroup] = useState(false);
  const [participantUsernames, setParticipantUsernames] = useState("");

  async function createConversation(
    type = "group",
    title,
    participant_usernames = []
  ) {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const resp = await fetch(`${API_BASE_URL}/api/conversation/create`, {
        method: "POST",
        credentials:"include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          title,
          participant_usernames,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        console.error(data);
        return;
      }

      // Adjust this depending on your backend response
      navigate("/app");
      // navigate(`/app/conversations/${data.conversation_id}`);
    } catch (err) {
      console.error("Failed to create conversation:", err);
    }
  }

  async function searchUsers(query) {
    if(!user) {
      navigate("/login");
      return;
    }

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const resp = await fetch(
        `${API_BASE_URL}/api/users/search?q=${encodeURIComponent(query)}`,{
          credentials:"include",
        });

      const data = await resp.json();

      if (!resp.ok) {
        console.error(data);
        return;
      }

      setSearchResults(data.users || []);
    } catch (err) {
      console.error("User search failed:", err);
    }
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const participants = participantUsernames
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean);

    createConversation(
      isGroup ? "group" : "private",
      title.trim(),
      participants
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
      <h1 className="text-2xl font-bold text-white">
        Create Conversation
      </h1>

      {/* User Search */}
      <div className="w-full max-w-md">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />

        <div className="mt-2 space-y-2">
          {searchResults.map((user) => (
            <div
              key={user.user_id}
              className="p-2 rounded bg-gray-800 text-white"
            >
              <div>{user.username}</div>
              <div className="text-sm text-gray-400">{user.email}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Conversation Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <input
          type="text"
          placeholder="Conversation Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
          required
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isGroup"
            checked={isGroup}
            onChange={(e) => setIsGroup(e.target.checked)}
            className="accent-blue-600"
          />
          <label htmlFor="isGroup" className="text-white">
            Group Conversation
          </label>
        </div>

        <input
          type="text"
          placeholder="Participant usernames (comma separated)"
          value={participantUsernames}
          onChange={(e) => setParticipantUsernames(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
        />

        <button
          type="submit"
          className="p-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
        >
          Create Conversation
        </button>
      </form>
    </div>
  );
}

export default CreateConversation;
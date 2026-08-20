import React , {useState, useEffect} from "react";
import SearchUsers from "./SearchUsers.jsx"
import { API_BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";

export default function PrivateChatForm() {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    function selectUser(user) {
        setSelectedUser(user);
    }

    function deselectUser() {
        setSelectedUser(null);
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(async() => {
            if (searchQuery.trim()) {
                await SearchUsers(searchQuery, setSearchResults);
            } else {
                setSearchResults([]);
            }
        }, 300);
        
        return () => clearTimeout(delayDebounceFn);
    } , [searchQuery]);
    
    async function createConversation(type = "private", participant_usernames = []) {
        try {
            const resp = await fetch(`${API_BASE_URL}/api/conversation/create`, {
                method: "POST",
                credentials:"include",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                type,
                participant_usernames,
                }),
            });

            const data = await resp.json();

            if (!resp.ok) {
                console.error(data);
                return;
            }

            navigate("/app");
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <div className = "ml-auto mr-5 w-50 text-center">
                <input 
                    type = "text"
                    placeholder = "🔍︎ Search Username"
                    value = {searchQuery}
                    onChange = {(e) => setSearchQuery(e.target.value)}
                    className = "w-full p-2 bg-gray-700 text-white border-2 border-amber-300 rounded-full"
                ></input>
            </div>

            {selectedUser ? (
                <div className = "flex items-center justify-center mt-4">
                    <div className = "bg-gray-700 text-white p-2 rounded-full flex items-center">
                        <span className = "mr-2">{selectedUser.username}</span>
                        <button 
                            onClick = {deselectUser}
                            className = "bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600"
                        >
                            X
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mt-2 space-y-2">
                    {searchResults.length == 0 && searchQuery.trim() !== "" && (
                        <div className="p-2 rounded bg-gray-800 text-white">
                            No users found.
                        </div>
                    )}
                    {searchResults.map((user) => (
                        <div
                        key={user.user_id}
                        className="p-2 rounded bg-gray-800 text-white"
                        onClick={() => selectUser(user)}
                        >
                        <div>{user.username}</div>
                        </div>
                    ))}
                </div>
            )}
            <div className = "flex justify-center mt-4 w-250">
            <button className = "mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick = {() => {
                    if (selectedUser) {
                        createConversation("private", [selectedUser.username]);
                    }
                }}
            >
                Start Private Chat
            </button>
            </div>
        </>
    )
}
import React, { useState, useEffect } from "react";
import SearchUsers from "./SearchUsers.jsx"
import { API_BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";

export default function GroupForm() {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [title, setTitle] = useState("");
    const [selectedUsernames, setSelectedUsernames] = useState([]);

    function addUserToSelected(user) {
        if (!selectedUsernames.includes(user.username)) {
            setSelectedUsernames([...selectedUsernames, user.username]);
        }
    }

    function removeUserFromSelected(username) {
        setSelectedUsernames(selectedUsernames.filter(u => u !== username));
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(async() => {
            if (searchQuery.trim()) {
                await SearchUsers(searchQuery, setSearchResults);
            } else {
                setSearchResults([]);
            }
        }, 300); // Adjust the debounce delay as needed

        console.log("searchResults", searchResults);

        setSearchResults(searchResults.filter(user => !selectedUsernames.includes(user.username)));

        return () => clearTimeout(delayDebounceFn);
    } , [searchQuery]);

    useEffect(() => {
        setSearchResults(searchResults.filter(user => !selectedUsernames.includes(user.username)));
    }, [selectedUsernames]);
    
    async function createConversation(type = "group", title, participant_usernames = []) {
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

            navigate("/app");
        } catch (err) {
            console.error("Failed to create conversation:", err);
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
                onClick={() => addUserToSelected(user)}
                >
                <div>{user.username}</div>
                </div>
            ))}
        </div>

        <form
            onSubmit = {(e) => {
                e.preventDefault();
                createConversation("group", title, selectedUsernames);
            }} 
            className = "flex flex-col gap-4 w-full max-w-md mt-4 mx-auto">
            <input 
                type = "text"
                placeholder = "Conversation Title"
                value = {title}
                onChange = {(e) => setTitle(e.target.value)}
                className = "w-full p-2 rounded bg-gray-700 text-white"
            ></input>

            <button
                type = "submit"
                className = "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Create Group
            </button>
        </form>

        <div>
            {selectedUsernames.length > 0 && (
                <div className="mt-2 space-y-2">
                    <h3 className="text-lg font-semibold text-white">Selected Users:</h3>
                    {selectedUsernames.map((username) => (
                        <div
                            key={username}
                            className="p-2 rounded bg-gray-800 text-white"
                            onClick={() => removeUserFromSelected(username)}
                        >   
                            {username}
                            <span className="mr-2">❌</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
        </>
    )   

}
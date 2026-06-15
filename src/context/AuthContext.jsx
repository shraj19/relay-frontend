import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config.js";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const parseResponse = async (response) => {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || "Request failed");
        }

        return data;
    };


    useEffect(() => {
        async function loadUser() {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/me`,{
                    credentials: "include",
                });
                const data = await parseResponse(response);
                
                setUser({username:data.username, email:data.email, created_at:data.created_at, user_id:data.user_id});   
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);


    const login = async (username, password) => {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await parseResponse(response);
        setUser({username:data.username, email:data.email, created_at:data.created_at, user_id:data.user_id});   

        return data;
    }

    const logout = async () => {
        await fetch(`${API_BASE_URL}/api/logout`, {
            method: "POST",
            credentials: "include",
        });
        setUser(null);
    }

    const signup = async (username, email, password) => {
        const response = await fetch(`${API_BASE_URL}/api/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
        });
        
        const data = await parseResponse(response);
        setUser({username:data.username, email:data.email, created_at:data.created_at, user_id:data.user_id});     

        return data;
    }

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider };
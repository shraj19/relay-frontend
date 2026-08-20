import { API_BASE_URL } from "../../config";

export default async function SearchUsers(query, setSearchedUsers) {
    try {
        const resp = await fetch(
            `${API_BASE_URL}/api/users/search?q=${encodeURIComponent(query)}`,
            {
                credentials: "include",
            }
        );

        const data = await resp.json();

        if (!resp.ok) {
            console.error(data);
            return;
        }

        setSearchedUsers(data.users || []);
    } catch (err) {
        console.error("User search failed:", err);
    }
}
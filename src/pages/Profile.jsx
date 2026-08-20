import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/signIn" replace />;
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-4 md:p-6 text-white">
      <div className="mx-auto max-w-lg mt-12">
        <h1 className="text-4xl font-semibold tracking-tight mb-8">Profile</h1>

        <div className="bg-zinc-800 rounded-xl p-6 space-y-4">
          <div>
            <p className="text-sm text-zinc-400">Username</p>
            <p className="text-lg">{user.username}</p>
          </div>

          <div>
            <p className="text-sm text-zinc-400">Email</p>
            <p className="text-lg">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-zinc-400">Member since</p>
            <p className="text-lg">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-6 w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

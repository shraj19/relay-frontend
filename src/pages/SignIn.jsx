import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
function SignIn() {
    const {user} = useAuth();
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [keepSignedIn, setKeepSignedIn] = useState(false);

    useEffect(() => {
        if (user) {
            navigate("/app");
        }
    }, [user, navigate]);

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            await login(username, password);
            navigate("/app");
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <main className="min-h-screen bg-zinc-100 p-4 md:p-6">
            <section className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-7xl grid-cols-1 gap-6 rounded-3xl border border-zinc-200 bg-zinc-50 p-5 md:min-h-[calc(100vh-3rem)] md:grid-cols-2 md:p-8">
                <div className="flex items-center">
                    <div className="mx-auto w-full max-w-md py-6">
                        <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-sm border border-zinc-900 bg-zinc-950 text-sm font-semibold text-zinc-100">
                            /\\
                        </div>

                        <h1 className="text-5xl font-semibold tracking-tight text-zinc-950 md:text-6xl">
                            Log In
                        </h1>
                        <p className="mt-4 text-lg leading-relaxed text-zinc-500">
                            Log In to connect with people.
                        </p>

                        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label
                                    htmlFor="username"
                                    className="block text-base font-semibold text-zinc-900"
                                >
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    className="h-12 w-full rounded-xl border border-zinc-300 bg-white px-4 text-base text-zinc-800 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="block text-base font-semibold text-zinc-900"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    className="h-12 w-full rounded-xl border border-zinc-300 bg-white px-4 text-base text-zinc-800 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                                    required
                                />
                            </div>

                            {/* <div className="flex items-center justify-between gap-4 pt-1">
                                <label className="inline-flex items-center gap-3 text-base font-semibold text-zinc-800">
                                    <input
                                        type="checkbox"
                                        checked={keepSignedIn}
                                        onChange={(event) => setKeepSignedIn(event.target.checked)}
                                        className="h-5 w-5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-300"
                                    />
                                    Keep me signed in
                                </label>
                                { <a href="#" className="text-base text-zinc-500 underline underline-offset-2 hover:text-zinc-700">
                                    Forgot password?
                                </a> }
                            </div> */}

                            <button
                                type="submit"
                                className="mt-1 h-12 w-full rounded-xl bg-zinc-950 text-lg font-semibold text-white transition hover:bg-zinc-800"
                            >
                                Log In
                            </button>

                            <p className="pt-2 text-center text-base text-zinc-500">
                                Don&apos;t have an account?{" "}
                                <a href="/signUp" className="font-medium text-zinc-900 underline underline-offset-2">
                                    Register
                                </a>
                            </p>
                        </form>
                    </div>
                </div>

                <aside className="relative hidden overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 md:flex md:items-center md:justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.3)_0,rgba(229,229,229,0.95)_60%,rgba(212,212,212,1)_100%)]" />
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-zinc-300 text-zinc-500">
                        <span className="text-sm">image</span>
                    </div>
                </aside>
            </section>
        </main>
    );
}

export default SignIn;
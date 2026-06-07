
function Home() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-500 to-purple-600">
            <div className="text-center text-white">
                <h1 className="text-5xl font-bold mb-4">Welcome to Relay</h1>
                <p className="text-lg mb-8">Connect with people and share your thoughts.</p>
                <a href="/signIn" className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition">
                    Get Started
                </a>
            </div>
        </main>
    )
}

export default Home;
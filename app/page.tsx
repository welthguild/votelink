export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-gray-100">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">VoteLink</h1>
        <p className="text-xl text-gray-600 mb-12">
          A modern voting platform for contests, polls, and community voting
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/admin"
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition shadow-lg"
          >
            Admin Panel
          </a>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-3">🗳️</div>
            <h3 className="text-lg font-bold mb-2">Easy Voting</h3>
            <p className="text-gray-600 text-sm">
              Simple, intuitive voting interface for all users
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-bold mb-2">Real-time Results</h3>
            <p className="text-gray-600 text-sm">
              Live vote counts and contestant standings
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-bold mb-2">Full Control</h3>
            <p className="text-gray-600 text-sm">
              Manage contests, contestants, and platforms
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

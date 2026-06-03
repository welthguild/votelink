export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">VoteLink</h1>
        <p className="text-lg text-foreground/70 mb-8">
          A modern voting platform for contests and events
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/admin"
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
          >
            Admin Panel
          </a>
        </div>
      </div>
    </main>
  )
}

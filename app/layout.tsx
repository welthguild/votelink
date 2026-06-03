import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VoteLink - Modern Voting Platform',
  description: 'A simple, powerful voting platform for contests and polls',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-background">
      <body>{children}</body>
    </html>
  )
}

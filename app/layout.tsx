import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Practice Test App',
  description: 'Teacher-created practice tests with auto-grading.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6" aria-label="Main navigation">
            <Link href="/" className="font-semibold tracking-tight text-slate-950">
              Study Hub
            </Link>
            <div className="flex items-center gap-1 text-sm font-medium text-slate-600">
              <Link className="rounded-lg px-3 py-2 transition-colors hover:bg-slate-100 hover:text-slate-950" href="/">
                Tests
              </Link>
              <Link className="rounded-lg px-3 py-2 transition-colors hover:bg-slate-100 hover:text-slate-950" href="/student">
                Student portal
              </Link>
              <Link className="rounded-lg bg-indigo-50 px-3 py-2 text-indigo-700 transition-colors hover:bg-indigo-100" href="/timetable">
                Fall 2026
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl p-4 md:p-6">{children}</main>
      </body>
    </html>
  );
}

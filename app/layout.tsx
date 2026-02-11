import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Practice Test App',
  description: 'Teacher-created practice tests with auto-grading.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto max-w-4xl p-4 md:p-6">{children}</main>
      </body>
    </html>
  );
}

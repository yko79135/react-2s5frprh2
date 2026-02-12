import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Practice Test App</h1>
      <p className="text-slate-700">Teacher dashboard + student test-taking + auto-grading.</p>
      <div className="flex flex-wrap gap-3">
        <Link className="bg-blue-600 text-white" href="/teacher/login">Teacher Login</Link>
        <Link className="bg-slate-700 text-white" href="/student">Student Portal</Link>
      </div>
    </div>
  );
}

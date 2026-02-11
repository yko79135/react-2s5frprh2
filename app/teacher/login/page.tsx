'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TeacherLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function submit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/teacher/login', { method: 'POST', body: JSON.stringify({ password }) });
    if (!res.ok) {
      setError('Invalid password');
      return;
    }
    router.push('/teacher/tests');
  }

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Teacher Login</h1>
      <form onSubmit={submit} className="space-y-3 rounded bg-white p-4 shadow">
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        {error && <p className="text-red-600">{error}</p>}
        <button className="bg-blue-600 text-white" type="submit">Sign in</button>
      </form>
    </div>
  );
}

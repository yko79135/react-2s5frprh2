'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentEntryPage({ params }: { params: { code: string } }) {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function start() {
    const res = await fetch('/api/student/start', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: params.code, nickname })
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Unable to start test');
    localStorage.setItem(`attempt:${params.code}`, data.attemptId);
    router.push(`/take/${params.code}/question/1?attemptId=${data.attemptId}`);
  }

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Join Test {params.code}</h1>
      <input placeholder="Nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
      {error && <p className="text-red-600">{error}</p>}
      <button className="bg-blue-600 text-white" onClick={start}>Start Test</button>
    </div>
  );
}

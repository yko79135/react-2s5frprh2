'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentLandingPage() {
  const [code, setCode] = useState('');
  const router = useRouter();

  function joinTest() {
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) return;
    router.push(`/take/${normalizedCode}`);
  }

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Student Test Portal</h1>
      <p className="text-slate-700">Enter your test code to join your assignment.</p>
      <input
        placeholder="e.g. BIO101"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') joinTest();
        }}
      />
      <button className="bg-blue-600 text-white" onClick={joinTest}>Continue</button>
    </div>
  );
}

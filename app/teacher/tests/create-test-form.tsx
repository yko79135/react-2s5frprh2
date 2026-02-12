'use client';

import { useState } from 'react';

const starter = `{
  "title": "Biology Practice Test - Chapter 3",
  "timeLimitMinutes": 40,
  "questions": []
}`;

export default function CreateTestForm() {
  const [json, setJson] = useState(starter);
  const [attemptsAllowed, setAttemptsAllowed] = useState(1);
  const [showAnswersAfterSubmit, setShowAnswers] = useState(false);
  const [showFeedbackAfterSubmit, setShowFeedback] = useState(true);
  const [message, setMessage] = useState('');

  async function submit() {
    setMessage('');
    const res = await fetch('/api/teacher/tests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ json, attemptsAllowed, showAnswersAfterSubmit, showFeedbackAfterSubmit })
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Failed to create test');
      return;
    }
    setMessage(`Created! Share code: ${data.code}`);
  }

  return (
    <section className="rounded bg-white p-4 shadow space-y-3">
      <h2 className="text-lg font-semibold">Create Test (paste JSON or plain-English test content)</h2>
      <textarea className="h-52" value={json} onChange={(e) => setJson(e.target.value)} />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <label>Attempts allowed<input type="number" min={1} value={attemptsAllowed} onChange={(e) => setAttemptsAllowed(Number(e.target.value))} /></label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={showAnswersAfterSubmit} onChange={(e) => setShowAnswers(e.target.checked)} />Show answers after submit</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={showFeedbackAfterSubmit} onChange={(e) => setShowFeedback(e.target.checked)} />Show feedback after submit</label>
      </div>
      <button className="bg-blue-600 text-white" onClick={submit}>Create test</button>
      {message && <p>{message}</p>}
    </section>
  );
}

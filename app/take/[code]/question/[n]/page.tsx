'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Question = { id: string; prompt: string; type: string; choices?: string[] };

export default function QuestionPage({ params }: { params: { code: string; n: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get('attemptId') || '';
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const index = Number(params.n) - 1;
  const current = questions[index];

  useEffect(() => {
    fetch(`/api/student/start?code=${params.code}&attemptId=${attemptId}`).then((r) => r.json()).then((d) => {
      setQuestions(d.questions || []);
      setTimeLeft(d.timeLeftSeconds ?? null);
    });
  }, [params.code, attemptId]);

  useEffect(() => {
    const saved = localStorage.getItem(`${attemptId}:${current?.id}`);
    if (saved) setAnswer(saved);
    else setAnswer('');
  }, [attemptId, current?.id]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      submitAll();
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => (v ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const total = questions.length;
  const hasNext = index < total - 1;
  const hasBack = index > 0;

  async function autosave() {
    if (!current) return;
    localStorage.setItem(`${attemptId}:${current.id}`, answer);
    await fetch('/api/student/answer', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attemptId, questionId: current.id, answer })
    });
  }

  async function move(delta: number) {
    await autosave();
    router.push(`/take/${params.code}/question/${index + 1 + delta}?attemptId=${attemptId}`);
  }

  async function submitAll() {
    await autosave();
    await fetch('/api/student/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ attemptId }) });
    router.push(`/take/${params.code}/review?attemptId=${attemptId}`);
  }

  const minutesLeft = useMemo(() => (timeLeft === null ? '-' : Math.max(0, Math.floor(timeLeft / 60))), [timeLeft]);

  if (!current) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">Time left: {minutesLeft}m</p>
      <h1 className="text-xl font-bold">Question {index + 1} of {total}</h1>
      <p>{current.prompt}</p>
      {current.type === 'multiple_choice' && (
        <div className="space-y-2">
          {current.choices?.map((choice) => (
            <label key={choice} className="flex items-center gap-2"><input type="radio" name="mc" value={choice.charAt(0)} checked={answer === choice.charAt(0)} onChange={(e) => setAnswer(e.target.value)} />{choice}</label>
          ))}
        </div>
      )}
      {current.type !== 'multiple_choice' && <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} className="h-40" />}
      <div className="flex gap-2">
        {hasBack && <button className="bg-slate-200" onClick={() => move(-1)}>Back</button>}
        {hasNext && <button className="bg-blue-600 text-white" onClick={() => move(1)}>Next</button>}
        {!hasNext && <button className="bg-green-600 text-white" onClick={submitAll}>Submit</button>}
      </div>
    </div>
  );
}

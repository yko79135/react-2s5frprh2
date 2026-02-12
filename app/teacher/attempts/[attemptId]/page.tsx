import { prisma } from '@/lib/prisma';
import { isTeacherAuthenticated } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import { parseQuestions } from '@/lib/test-service';
import { isPrismaUnavailableError } from '@/lib/prisma-safe';

export default async function AttemptDetailPage({ params }: { params: { attemptId: string } }) {
  if (!isTeacherAuthenticated()) redirect('/teacher/login');

  let attempt;
  try {
    attempt = await prisma.attempt.findUnique({ where: { id: params.attemptId }, include: { Test: true, answers: true } });
  } catch (error) {
    if (isPrismaUnavailableError(error)) notFound();
    throw error;
  }

  if (!attempt) notFound();
  const questions = parseQuestions(attempt.Test.questionsJson);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Attempt: {attempt.nickname}</h1>
      <p>{attempt.totalScore ?? '-'} / {attempt.maxScore ?? '-'}</p>
      {questions.map((q) => {
        const answer = attempt.answers.find((a) => a.questionId === q.id);
        return (
          <article key={q.id} className="rounded bg-white p-4 shadow space-y-1">
            <h3 className="font-semibold">{q.id}: {q.prompt}</h3>
            <p><b>Student answer:</b> {answer?.answerText || '(blank)'}</p>
            <p><b>Score:</b> {answer?.score ?? '-'} / {answer?.maxScore ?? '-'}</p>
            {answer?.feedbackJson && <pre className="whitespace-pre-wrap text-sm bg-slate-100 p-2 rounded">{answer.feedbackJson}</pre>}
          </article>
        );
      })}
    </div>
  );
}

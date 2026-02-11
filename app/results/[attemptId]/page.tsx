import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { parseQuestions } from '@/lib/test-service';

export default async function ResultsPage({ params }: { params: { attemptId: string } }) {
  const attempt = await prisma.attempt.findUnique({ where: { id: params.attemptId }, include: { Test: true, answers: true } });
  if (!attempt) notFound();
  const questions = parseQuestions(attempt.Test.questionsJson);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Results: {attempt.nickname}</h1>
      <p>Total score: {attempt.totalScore ?? '-'} / {attempt.maxScore ?? '-'}</p>
      {questions.map((q) => {
        const ans = attempt.answers.find((a) => a.questionId === q.id);
        return (
          <article className="rounded bg-white p-4 shadow" key={q.id}>
            <h3 className="font-semibold">{q.prompt}</h3>
            <p><b>Your answer:</b> {ans?.answerText || '(blank)'}</p>
            <p><b>Score:</b> {ans?.score ?? '-'} / {ans?.maxScore ?? q.points}</p>
            {attempt.Test.showFeedbackAfterSubmit && ans?.feedbackJson && <pre className="whitespace-pre-wrap text-sm">{ans.feedbackJson}</pre>}
            {attempt.Test.showAnswersAfterSubmit && q.type !== 'essay' && (
              <p className="text-sm text-slate-700">Correct: {q.type === 'multiple_choice' ? q.answer : q.answers.join(' | ')}</p>
            )}
          </article>
        );
      })}
    </div>
  );
}

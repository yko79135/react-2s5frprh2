import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseQuestions } from '@/lib/test-service';
import { gradeDeterministic, gradeEssay } from '@/lib/grading';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const attemptId = String(body.attemptId || '');
  const attempt = await prisma.attempt.findUnique({ where: { id: attemptId }, include: { Test: true, answers: true } });
  if (!attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });

  const questions = parseQuestions(attempt.Test.questionsJson);
  let total = 0;
  let max = 0;
  for (const q of questions) {
    const a = attempt.answers.find((it) => it.questionId === q.id);
    const answerText = a?.answerText || '';
    if (!a) {
      await prisma.answer.create({ data: { attemptId: attempt.id, questionId: q.id, answerText } });
    }

    if (q.type === 'essay') {
      const essay = await gradeEssay(answerText, q.prompt, q.rubric, attempt.testId);
      total += essay.score || 0;
      max += q.points;
      await prisma.answer.update({
        where: { attemptId_questionId: { attemptId: attempt.id, questionId: q.id } },
        data: {
          score: essay.score,
          maxScore: q.points,
          correct: null,
          feedbackJson: JSON.stringify(essay, null, 2),
          gradedAt: new Date()
        }
      });
      continue;
    }

    const result = gradeDeterministic(q, answerText);
    total += result.score;
    max += result.maxScore;
    await prisma.answer.update({
      where: { attemptId_questionId: { attemptId: attempt.id, questionId: q.id } },
      data: {
        score: result.score,
        maxScore: result.maxScore,
        correct: result.correct,
        feedbackJson: q.explanation || null,
        gradedAt: new Date()
      }
    });
  }

  await prisma.attempt.update({ where: { id: attempt.id }, data: { status: 'submitted', submittedAt: new Date(), totalScore: total, maxScore: max } });
  return NextResponse.json({ ok: true, totalScore: total, maxScore: max });
}

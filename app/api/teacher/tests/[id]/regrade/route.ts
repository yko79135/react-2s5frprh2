import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseQuestions } from '@/lib/test-service';
import { gradeEssay } from '@/lib/grading';
import { requireTeacher } from '@/lib/auth';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    requireTeacher();
    const test = await prisma.test.findUnique({ where: { id: params.id }, include: { attempts: { include: { answers: true } } } });
    if (!test) return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    const questions = parseQuestions(test.questionsJson).filter((q) => q.type === 'essay');

    for (const attempt of test.attempts) {
      for (const question of questions) {
        const ans = attempt.answers.find((a) => a.questionId === question.id);
        const essay = await gradeEssay(ans?.answerText || '', question.prompt, question.rubric, test.id);
        await prisma.answer.upsert({
          where: { attemptId_questionId: { attemptId: attempt.id, questionId: question.id } },
          update: { score: essay.score, maxScore: question.points, feedbackJson: JSON.stringify(essay, null, 2), gradedAt: new Date() },
          create: { attemptId: attempt.id, questionId: question.id, answerText: ans?.answerText || '', score: essay.score, maxScore: question.points, feedbackJson: JSON.stringify(essay, null, 2), gradedAt: new Date() }
        });
      }
    }

    return NextResponse.redirect(new URL(`/teacher/tests/${params.id}`, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

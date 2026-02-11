import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { attemptId, questionId, answer } = body;
  if (!attemptId || !questionId || typeof answer !== 'string') {
    return NextResponse.json({ error: 'Malformed input' }, { status: 400 });
  }
  await prisma.answer.upsert({
    where: { attemptId_questionId: { attemptId, questionId } },
    update: { answerText: answer },
    create: { attemptId, questionId, answerText: answer }
  });
  return NextResponse.json({ ok: true });
}

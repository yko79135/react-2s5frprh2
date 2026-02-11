import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseQuestions } from '@/lib/test-service';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const code = String(body.code || '').toUpperCase();
  const nickname = String(body.nickname || '').trim();
  if (!code || !nickname) return NextResponse.json({ error: 'Code and nickname are required' }, { status: 400 });

  const test = await prisma.test.findUnique({ where: { code }, include: { attempts: true } });
  if (!test) return NextResponse.json({ error: 'Test not found' }, { status: 404 });
  const existing = test.attempts.filter((a) => a.nickname === nickname).length;
  if (existing >= test.attemptsAllowed) {
    return NextResponse.json({ error: 'Attempts exceeded' }, { status: 403 });
  }

  const attempt = await prisma.attempt.create({ data: { testId: test.id, nickname } });
  return NextResponse.json({ attemptId: attempt.id });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = String(searchParams.get('code') || '').toUpperCase();
  const attemptId = String(searchParams.get('attemptId') || '');
  const attempt = await prisma.attempt.findUnique({ where: { id: attemptId }, include: { Test: true } });
  if (!attempt || attempt.Test.code !== code) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
  const questions = parseQuestions(attempt.Test.questionsJson).map((q) => ({
    id: q.id,
    type: q.type,
    prompt: q.prompt,
    choices: q.type === 'multiple_choice' ? q.choices : undefined
  }));
  const endTime = new Date(attempt.startedAt).getTime() + attempt.Test.timeLimitMinutes * 60_000;
  return NextResponse.json({ questions, timeLeftSeconds: Math.floor((endTime - Date.now()) / 1000) });
}

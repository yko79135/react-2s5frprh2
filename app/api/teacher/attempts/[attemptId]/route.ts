import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTeacher } from '@/lib/auth';

export async function GET(_: Request, { params }: { params: { attemptId: string } }) {
  try {
    requireTeacher();
    const attempt = await prisma.attempt.findUnique({ where: { id: params.attemptId }, include: { answers: true, Test: true } });
    if (!attempt) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(attempt);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

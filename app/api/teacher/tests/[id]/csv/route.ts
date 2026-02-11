import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTeacher } from '@/lib/auth';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    requireTeacher();
    const attempts = await prisma.attempt.findMany({ where: { testId: params.id }, orderBy: { startedAt: 'asc' } });
    const lines = ['attemptId,nickname,status,totalScore,maxScore,startedAt,submittedAt'];
    lines.push(...attempts.map((a) => [a.id, a.nickname, a.status, a.totalScore ?? '', a.maxScore ?? '', a.startedAt.toISOString(), a.submittedAt?.toISOString() ?? ''].join(',')));
    return new NextResponse(lines.join('\n'), { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="scores.csv"' } });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

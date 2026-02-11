import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { createTeacherSession } from '@/lib/auth';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (body.password !== env.teacherPassword) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  createTeacherSession();
  return NextResponse.json({ ok: true });
}

import { NextResponse } from 'next/server';
import { createTestFromJson } from '@/lib/test-service';
import { requireTeacher } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    requireTeacher();
    const body = await req.json();
    const parsedJson = JSON.parse(body.json || '{}');
    const test = await createTestFromJson(parsedJson, {
      attemptsAllowed: Number(body.attemptsAllowed || 1),
      showAnswersAfterSubmit: !!body.showAnswersAfterSubmit,
      showFeedbackAfterSubmit: !!body.showFeedbackAfterSubmit
    });
    return NextResponse.json({ id: test.id, code: test.code });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid input' }, { status: 400 });
  }
}

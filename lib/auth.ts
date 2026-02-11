import crypto from 'crypto';
import { cookies } from 'next/headers';
import { env } from './env';

const COOKIE_NAME = 'teacher_session';

function sign(value: string) {
  return crypto.createHmac('sha256', env.teacherSessionSecret).update(value).digest('hex');
}

export function createTeacherSession() {
  const raw = `teacher:${Date.now()}`;
  const token = `${raw}.${sign(raw)}`;
  cookies().set(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' });
}

export function isTeacherAuthenticated() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return false;
  const [raw, signature] = token.split('.');
  return sign(raw) === signature && raw.startsWith('teacher:');
}

export function requireTeacher() {
  if (!isTeacherAuthenticated()) {
    throw new Error('Unauthorized');
  }
}

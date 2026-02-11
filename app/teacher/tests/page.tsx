import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import CreateTestForm from './create-test-form';
import { isTeacherAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function TeacherTestsPage() {
  if (!isTeacherAuthenticated()) redirect('/teacher/login');
  const tests = await prisma.test.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Teacher Tests</h1>
      <CreateTestForm />
      <section className="space-y-3">
        {tests.map((test) => (
          <Link key={test.id} className="block rounded bg-white p-4 shadow" href={`/teacher/tests/${test.id}`}>
            <div className="font-semibold">{test.title}</div>
            <div className="text-sm text-slate-600">Code: {test.code}</div>
          </Link>
        ))}
      </section>
    </div>
  );
}

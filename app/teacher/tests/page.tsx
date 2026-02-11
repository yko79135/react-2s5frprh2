import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import CreateTestForm from './create-test-form';
import { isTeacherAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';

function DbSetupWarning({ message }: { message: string }) {
  return (
    <div className="rounded border border-amber-300 bg-amber-50 p-4 text-amber-900 space-y-2">
      <p className="font-semibold">Database is not ready yet.</p>
      <p className="text-sm">{message}</p>
      <p className="text-sm">Run these commands locally:</p>
      <pre className="overflow-auto rounded bg-amber-100 p-2 text-xs">npm run prisma:generate{`\n`}npm run prisma:migrate{`\n`}npm run prisma:seed</pre>
    </div>
  );
}

export default async function TeacherTestsPage() {
  if (!isTeacherAuthenticated()) redirect('/teacher/login');

  try {
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
          {tests.length === 0 && <p className="text-slate-600">No tests yet. Paste JSON above to create your first test.</p>}
        </section>
      </div>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database error';
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Teacher Tests</h1>
        <DbSetupWarning message={message} />
      </div>
    );
  }
}

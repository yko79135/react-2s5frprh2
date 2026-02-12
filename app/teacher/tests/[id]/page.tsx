import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { isTeacherAuthenticated } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { isPrismaUnavailableError } from '@/lib/prisma-safe';

export default async function TeacherTestDetailPage({ params }: { params: { id: string } }) {
  if (!isTeacherAuthenticated()) redirect('/teacher/login');

  let test;
  try {
    test = await prisma.test.findUnique({ where: { id: params.id }, include: { attempts: { orderBy: { startedAt: 'desc' } } } });
  } catch (error) {
    if (isPrismaUnavailableError(error)) notFound();
    throw error;
  }

  if (!test) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{test.title}</h1>
      <p>Test Code: <span className="font-mono font-semibold">{test.code}</span></p>
      <p>Student link: <Link className="text-blue-600" href={`/take/${test.code}`}>/take/{test.code}</Link></p>
      <div className="flex gap-3">
        <Link className="bg-slate-800 text-white" href={`/api/teacher/tests/${test.id}/csv`}>Export CSV</Link>
        <form action={`/api/teacher/tests/${test.id}/regrade`} method="post"><button className="bg-orange-600 text-white" type="submit">Regrade essays</button></form>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Attempts</h2>
        {test.attempts.map((a) => (
          <Link className="block rounded bg-white p-3 shadow" key={a.id} href={`/teacher/attempts/${a.id}`}>
            {a.nickname} — {a.status} — {a.totalScore ?? '-'} / {a.maxScore ?? '-'}
          </Link>
        ))}
      </section>
    </div>
  );
}

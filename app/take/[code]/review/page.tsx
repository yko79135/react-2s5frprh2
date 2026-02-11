'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ReviewPage() {
  const params = useSearchParams();
  const attemptId = params.get('attemptId') || '';
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Submitted</h1>
      <p>Your test has been submitted and graded.</p>
      <Link className="text-blue-600" href={`/results/${attemptId}`}>View results</Link>
    </div>
  );
}

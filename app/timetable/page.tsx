const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

const courses = [
  {
    code: 'CS 301',
    name: 'Data Structures',
    days: ['Monday', 'Wednesday'],
    time: '9:00–10:15 AM',
    location: 'Science Hall 204',
    color: 'bg-indigo-50 border-indigo-200 text-indigo-950',
    badge: 'bg-indigo-600'
  },
  {
    code: 'MATH 240',
    name: 'Linear Algebra',
    days: ['Tuesday', 'Thursday'],
    time: '10:30–11:45 AM',
    location: 'Newton 118',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-950',
    badge: 'bg-emerald-600'
  },
  {
    code: 'ENG 215',
    name: 'Technical Writing',
    days: ['Monday', 'Wednesday'],
    time: '1:00–2:15 PM',
    location: 'Liberal Arts 310',
    color: 'bg-amber-50 border-amber-200 text-amber-950',
    badge: 'bg-amber-600'
  },
  {
    code: 'CS 301L',
    name: 'Data Structures Lab',
    days: ['Friday'],
    time: '11:00 AM–12:50 PM',
    location: 'Computing Lab 2',
    color: 'bg-violet-50 border-violet-200 text-violet-950',
    badge: 'bg-violet-600'
  }
] as const;

export default function TimetablePage() {
  return (
    <div className="space-y-8 pb-10">
      <section className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-lg md:px-10 md:py-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">My timetable</p>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Fall 2026</h1>
            <p className="mt-3 max-w-xl text-slate-300">Your weekly classes, all in one place. The semester runs August 24–December 11.</p>
          </div>
          <div className="flex gap-6 rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
            <div><p className="text-2xl font-bold">4</p><p className="text-xs text-slate-300">Courses</p></div>
            <div className="border-l border-white/20 pl-6"><p className="text-2xl font-bold">13</p><p className="text-xs text-slate-300">Credits</p></div>
          </div>
        </div>
      </section>

      <section aria-labelledby="weekly-schedule">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 id="weekly-schedule" className="text-2xl font-bold tracking-tight">Weekly schedule</h2>
            <p className="mt-1 text-sm text-slate-500">All times shown in your local time zone</p>
          </div>
          <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:block">Schedule confirmed</span>
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          {weekdays.map((day) => {
            const dayCourses = courses.filter((course) => course.days.includes(day as never));
            return (
              <div key={day} className="min-h-52 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-semibold text-slate-900">{day}</h3>
                  <span className="text-xs text-slate-400">{dayCourses.length || '—'}</span>
                </div>
                <div className="space-y-3">
                  {dayCourses.length ? dayCourses.map((course) => (
                    <article key={course.code} className={`rounded-xl border p-3 ${course.color}`}>
                      <div className="mb-2 flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${course.badge}`} aria-hidden="true" />
                        <p className="text-xs font-bold tracking-wide">{course.code}</p>
                      </div>
                      <h4 className="text-sm font-semibold leading-snug">{course.name}</h4>
                      <p className="mt-3 text-xs font-medium">{course.time}</p>
                      <p className="mt-1 text-xs opacity-70">{course.location}</p>
                    </article>
                  )) : <p className="py-10 text-center text-sm text-slate-400">No classes</p>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Next up</p>
          <div className="mt-3 flex items-start gap-4">
            <div className="rounded-xl bg-indigo-600 px-3 py-2 text-center text-white"><p className="text-xs">AUG</p><p className="text-xl font-bold">24</p></div>
            <div><h2 className="font-semibold">First day of classes</h2><p className="mt-1 text-sm text-slate-500">Your fall schedule begins Monday at 9:00 AM.</p></div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Important date</p>
          <div className="mt-3 flex items-start gap-4">
            <div className="rounded-xl bg-slate-100 px-3 py-2 text-center text-slate-700"><p className="text-xs">SEP</p><p className="text-xl font-bold">04</p></div>
            <div><h2 className="font-semibold">Add/drop deadline</h2><p className="mt-1 text-sm text-slate-500">Last day to make changes to your fall schedule.</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}

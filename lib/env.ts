export const env = {
  teacherPassword: process.env.TEACHER_PASSWORD || 'changeme',
  teacherSessionSecret: process.env.TEACHER_SESSION_SECRET || 'dev-secret',
  openAiKey: process.env.OPENAI_API_KEY || ''
};

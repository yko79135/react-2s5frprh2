import { z } from 'zod';

export const rubricSchema = z.object({
  maxScore: z.number().int().positive(),
  dimensions: z.array(z.object({
    name: z.string().min(1),
    maxScore: z.number().int().nonnegative(),
    description: z.string().min(1)
  })).min(1)
});

const mc = z.object({
  id: z.string(),
  type: z.literal('multiple_choice'),
  prompt: z.string(),
  choices: z.array(z.string()).min(2),
  answer: z.string(),
  points: z.number().positive(),
  explanation: z.string().optional()
});

const short = z.object({
  id: z.string(),
  type: z.literal('short_answer'),
  prompt: z.string(),
  answers: z.array(z.string()).min(1),
  points: z.number().positive(),
  explanation: z.string().optional()
});

const essay = z.object({
  id: z.string(),
  type: z.literal('essay'),
  prompt: z.string(),
  rubric: rubricSchema,
  points: z.number().positive(),
  explanation: z.string().optional()
});

export const questionSchema = z.discriminatedUnion('type', [mc, short, essay]);

export const practiceTestSchema = z.object({
  title: z.string().min(1),
  timeLimitMinutes: z.number().int().positive(),
  questions: z.array(questionSchema).min(1)
});

export type PracticeTest = z.infer<typeof practiceTestSchema>;
export type PracticeQuestion = z.infer<typeof questionSchema>;

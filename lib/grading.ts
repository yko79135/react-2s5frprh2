import OpenAI from 'openai';
import { env } from './env';
import { normalizeAnswer } from './utils';
import type { PracticeQuestion } from './test-schema';

const MAX_ESSAY_CHARS = 2500;
const rateBucket = new Map<string, number[]>();

export type EssayGrade = {
  score: number;
  maxScore: number;
  dimensions: { name: string; score: number; maxScore: number; notes: string }[];
  strengths: string[];
  improvements: string[];
  revisionSuggestions: string[];
  overallFeedback: string;
  warning?: string;
  error?: string;
};

const essaySchema = {
  type: 'object',
  required: ['score', 'maxScore', 'dimensions', 'strengths', 'improvements', 'revisionSuggestions', 'overallFeedback'],
  properties: {
    score: { type: 'number' },
    maxScore: { type: 'number' },
    dimensions: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'score', 'maxScore', 'notes'],
        properties: {
          name: { type: 'string' },
          score: { type: 'number' },
          maxScore: { type: 'number' },
          notes: { type: 'string' }
        }
      }
    },
    strengths: { type: 'array', items: { type: 'string' } },
    improvements: { type: 'array', items: { type: 'string' } },
    revisionSuggestions: { type: 'array', items: { type: 'string' } },
    overallFeedback: { type: 'string' }
  }
};

export function gradeDeterministic(question: PracticeQuestion, studentAnswer: string) {
  if (question.type === 'multiple_choice') {
    const correct = normalizeAnswer(studentAnswer) === normalizeAnswer(question.answer);
    return { score: correct ? question.points : 0, maxScore: question.points, correct };
  }
  if (question.type === 'short_answer') {
    const val = normalizeAnswer(studentAnswer);
    const correct = question.answers.some((answer) => normalizeAnswer(answer) === val);
    return { score: correct ? question.points : 0, maxScore: question.points, correct };
  }
  return { score: 0, maxScore: question.points, correct: false };
}

function allowRateLimit(key: string) {
  const now = Date.now();
  const windowStart = now - 60_000;
  const calls = (rateBucket.get(key) || []).filter((t) => t > windowStart);
  if (calls.length >= 3) return false;
  calls.push(now);
  rateBucket.set(key, calls);
  return true;
}

function parseGrade(raw: string): EssayGrade | null {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed as EssayGrade;
  } catch {
    return null;
  }
}

export async function gradeEssay(answer: string, prompt: string, rubric: unknown, testId: string): Promise<EssayGrade> {
  if (!allowRateLimit(testId)) {
    return {
      score: 0,
      maxScore: 0,
      dimensions: [],
      strengths: [],
      improvements: [],
      revisionSuggestions: [],
      overallFeedback: 'Pending manual review due to essay grading rate limit.',
      error: 'RATE_LIMITED'
    };
  }

  let safeAnswer = answer;
  let warning: string | undefined;
  if (answer.length > MAX_ESSAY_CHARS) {
    safeAnswer = answer.slice(0, MAX_ESSAY_CHARS);
    warning = `Essay was truncated to ${MAX_ESSAY_CHARS} characters.`;
  }

  if (!env.openAiKey) {
    return {
      score: 0,
      maxScore: 0,
      dimensions: [],
      strengths: [],
      improvements: [],
      revisionSuggestions: [],
      overallFeedback: 'Pending manual review because LLM key is not configured.',
      warning,
      error: 'NO_API_KEY'
    };
  }

  const client = new OpenAI({ apiKey: env.openAiKey });
  const payload = `Rubric:\n${JSON.stringify(rubric)}\n\nPrompt:\n${prompt}\n\nStudent Answer:\n${safeAnswer}`;

  for (let i = 0; i < 2; i++) {
    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0,
        messages: [
          { role: 'system', content: 'You are a strict but helpful teacher. Grade ONLY using the rubric. Do not invent facts. Be specific.' },
          { role: 'user', content: `${payload}\n\nOutput valid JSON matching this schema:\n${JSON.stringify(essaySchema)}` }
        ],
        response_format: { type: 'json_object' }
      });
      const raw = response.choices[0]?.message?.content || '';
      const parsed = parseGrade(raw);
      if (parsed) return { ...parsed, warning };
    } catch {
      // retry once
    }
  }

  return {
    score: 0,
    maxScore: 0,
    dimensions: [],
    strengths: [],
    improvements: [],
    revisionSuggestions: [],
    overallFeedback: 'Pending manual review due to essay grading error.',
    warning,
    error: 'LLM_FAILURE'
  };
}

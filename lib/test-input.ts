import OpenAI from 'openai';
import { env } from './env';

const jsonSchemaPrompt = `Convert teacher-authored test instructions into valid JSON with this exact shape:\n{\n  "title": string,\n  "timeLimitMinutes": number,\n  "questions": [\n    {\n      "id": string,\n      "type": "multiple_choice" | "short_answer" | "essay",\n      "prompt": string,\n      "choices"?: string[],\n      "answer"?: string,\n      "answers"?: string[],\n      "rubric"?: {\n        "maxScore": number,\n        "dimensions": [{ "name": string, "maxScore": number, "description": string }]\n      },\n      "points": number,\n      "explanation"?: string\n    }\n  ]\n}\n\nRules:\n- Always produce JSON only.\n- Keep questions faithful to teacher intent.\n- Ensure IDs are unique and short (q1, q2...).\n- If an answer key is missing, use short_answer with answers [\"\"].\n- If time limit is not specified, use 30.\n- Ensure at least one question.`;

function buildFallbackTest(input: string) {
  const lines = input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const title = lines[0]?.slice(0, 120) || 'Practice Test';

  const questionSeeds = lines
    .filter((line) => /\?$/.test(line) || /^\d+[.)-:]\s+/.test(line) || /^question\s*\d+/i.test(line))
    .map((line) => line.replace(/^\d+[.)-:]\s+/, '').replace(/^question\s*\d+[:.)-]?\s*/i, '').trim())
    .filter(Boolean);

  const candidates = questionSeeds.length ? questionSeeds : [lines.slice(1).join(' ').trim()].filter(Boolean);

  return {
    title,
    timeLimitMinutes: 30,
    questions: candidates.map((prompt, index) => ({
      id: `q${index + 1}`,
      type: 'short_answer' as const,
      prompt,
      answers: [''],
      points: 1,
      explanation: 'Auto-generated from pasted plain text. Update as needed.'
    }))
  };
}

export async function parseTestInput(rawInput: string) {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    throw new Error('Please paste a test first.');
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    // Not JSON, continue with conversion.
  }

  if (!env.openAiKey) {
    return buildFallbackTest(trimmed);
  }

  const client = new OpenAI({ apiKey: env.openAiKey });
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      messages: [
        { role: 'system', content: 'You transform teacher input into valid test JSON.' },
        { role: 'user', content: `${jsonSchemaPrompt}\n\nTeacher input:\n${trimmed}` }
      ],
      response_format: { type: 'json_object' }
    });
    const content = response.choices[0]?.message?.content || '';
    const parsed = JSON.parse(content);
    return parsed;
  } catch {
    return buildFallbackTest(trimmed);
  }
}

import { describe, expect, it } from 'vitest';
import { parseTestInput } from '@/lib/test-input';

describe('parseTestInput', () => {
  it('returns parsed object when input is valid JSON', async () => {
    const parsed = await parseTestInput('{"title":"T","timeLimitMinutes":10,"questions":[{"id":"q1","type":"short_answer","prompt":"Why?","answers":["Because"],"points":1}]}');
    expect(parsed.title).toBe('T');
    expect(parsed.questions).toHaveLength(1);
  });

  it('builds a fallback test from plain text input', async () => {
    const plain = `Biology Pop Quiz\n1) What is photosynthesis?\n2) Why do plants need sunlight?`;
    const parsed = await parseTestInput(plain);
    expect(parsed.title).toContain('Biology Pop Quiz');
    expect(parsed.questions.length).toBeGreaterThanOrEqual(1);
    expect(parsed.questions[0].type).toBe('short_answer');
  });
});

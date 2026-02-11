import { describe, expect, it } from 'vitest';
import { gradeDeterministic } from '@/lib/grading';

describe('gradeDeterministic', () => {
  it('grades multiple choice correctly', () => {
    const question = { id: 'q1', type: 'multiple_choice', prompt: 'x', choices: ['A', 'B'], answer: 'B', points: 1 } as const;
    expect(gradeDeterministic(question as never, 'B').score).toBe(1);
    expect(gradeDeterministic(question as never, 'A').score).toBe(0);
  });

  it('grades short answer with punctuation/case normalization', () => {
    const question = {
      id: 'q2',
      type: 'short_answer',
      prompt: 'Define',
      answers: ['movement of water across a semipermeable membrane'],
      points: 2
    } as const;
    expect(gradeDeterministic(question as never, 'Movement of water across a semipermeable membrane.').score).toBe(2);
  });
});

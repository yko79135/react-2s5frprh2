import { prisma } from './prisma';
import { makeTestCode } from './utils';
import { practiceTestSchema } from './test-schema';

export async function createTestFromJson(input: unknown, settings: { attemptsAllowed?: number; showAnswersAfterSubmit?: boolean; showFeedbackAfterSubmit?: boolean }) {
  const parsed = practiceTestSchema.parse(input);
  let code = makeTestCode();
  while (await prisma.test.findUnique({ where: { code } })) {
    code = makeTestCode();
  }

  return prisma.test.create({
    data: {
      code,
      title: parsed.title,
      timeLimitMinutes: parsed.timeLimitMinutes,
      questionsJson: JSON.stringify(parsed.questions),
      attemptsAllowed: settings.attemptsAllowed ?? 1,
      showAnswersAfterSubmit: settings.showAnswersAfterSubmit ?? false,
      showFeedbackAfterSubmit: settings.showFeedbackAfterSubmit ?? true
    }
  });
}

export function parseQuestions(questionsJson: string) {
  const raw = JSON.parse(questionsJson);
  return practiceTestSchema.shape.questions.parse(raw);
}

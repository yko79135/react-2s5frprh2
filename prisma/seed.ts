import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const demoTest = {
  title: 'Biology Practice Test - Chapter 3',
  timeLimitMinutes: 40,
  questions: [
    {
      id: 'q1',
      type: 'multiple_choice',
      prompt: 'Which statement is true about osmosis?',
      choices: ['A. Solute moves from low to high concentration', 'B. Water moves across semipermeable membrane', 'C. ATP is always required', 'D. It only occurs in plants'],
      answer: 'B',
      points: 1,
      explanation: 'Osmosis is water movement across semipermeable membrane.'
    },
    {
      id: 'q2',
      type: 'short_answer',
      prompt: 'Define osmosis in one sentence.',
      answers: ['movement of water across a semipermeable membrane', 'water moves from high to low water potential'],
      points: 2,
      explanation: 'Key idea: movement of water through semipermeable membrane.'
    },
    {
      id: 'q3',
      type: 'essay',
      prompt: 'Explain how photosynthesis and cellular respiration are related.',
      rubric: {
        maxScore: 10,
        dimensions: [
          { name: 'Accuracy', maxScore: 4, description: 'Correct science and relationships.' },
          { name: 'Completeness', maxScore: 3, description: 'Covers key steps and inputs/outputs.' },
          { name: 'Clarity', maxScore: 2, description: 'Well organized and understandable.' },
          { name: 'Examples', maxScore: 1, description: 'Uses at least one helpful example.' }
        ]
      },
      points: 10
    }
  ]
};

async function main() {
  await prisma.test.upsert({
    where: { code: 'BIO101' },
    update: {
      title: demoTest.title,
      timeLimitMinutes: demoTest.timeLimitMinutes,
      questionsJson: JSON.stringify(demoTest.questions)
    },
    create: {
      code: 'BIO101',
      title: demoTest.title,
      timeLimitMinutes: demoTest.timeLimitMinutes,
      attemptsAllowed: 1,
      showAnswersAfterSubmit: true,
      showFeedbackAfterSubmit: true,
      questionsJson: JSON.stringify(demoTest.questions)
    }
  });
}

main().finally(async () => prisma.$disconnect());

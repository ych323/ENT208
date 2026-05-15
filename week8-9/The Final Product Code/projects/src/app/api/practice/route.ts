import { NextRequest, NextResponse } from 'next/server';
import { createBigModelChatCompletion } from '@/lib/bigmodel';

type PracticeMode = 'interview' | 'written';

function clampQuestionCount(value: unknown) {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return 6;
  return Math.min(10, Math.max(4, Math.round(parsed)));
}

function buildFallback(
  mode: PracticeMode,
  role: string,
  company: string,
  level: string,
  focus: string,
  difficulty: string,
  questionCount: number,
  scenario: string,
) {
  const roleLabel = role || 'general product and engineering roles';
  const companyLabel = company || 'a realistic hiring team';
  const focusLabel = focus || 'core problem solving, communication, and evidence from past work';
  const levelLabel = level || 'intern';
  const difficultyLabel = difficulty || 'realistic';
  const scenarioLabel = scenario || (mode === 'written' ? 'timed written assessment' : 'role-specific mock interview');
  const questions = Array.from({ length: questionCount }, (_, index) => index + 1);

  if (mode === 'written') {
    return [
      `Written test set for ${levelLabel} ${roleLabel} candidates targeting ${companyLabel}. Difficulty: ${difficultyLabel}. Scenario: ${scenarioLabel}.`,
      ...questions.map(
        (item) =>
          `Question ${item}. Solve a ${focusLabel} task that fits ${roleLabel}. State assumptions, outline the approach, identify one tradeoff, and define what a strong answer should prove.`,
      ),
      'Reviewer rubric. Score for correctness, structure, role relevance, tradeoff awareness, and clarity under time pressure.',
    ].join('\n\n');
  }

  return [
    `Mock interview loop for a ${levelLabel} ${roleLabel} candidate targeting ${companyLabel}. Difficulty: ${difficultyLabel}. Scenario: ${scenarioLabel}.`,
    ...questions.map(
      (item) =>
        `Question ${item}. Ask a role-specific question about ${focusLabel}. Follow up on scope, ownership, measurable outcome, tradeoffs, and what signal a strong answer should show.`,
    ),
    'Scoring rubric. Score for clarity, evidence, structured thinking, role fit, communication, and follow-through.',
  ].join('\n\n');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const mode: PracticeMode = body.mode === 'written' ? 'written' : 'interview';
    const role = typeof body.role === 'string' ? body.role.trim() : '';
    const company = typeof body.company === 'string' ? body.company.trim() : '';
    const level = typeof body.level === 'string' ? body.level.trim() : '';
    const focus = typeof body.focus === 'string' ? body.focus.trim() : '';
    const difficulty = typeof body.difficulty === 'string' ? body.difficulty.trim() : 'Realistic';
    const scenario = typeof body.scenario === 'string' ? body.scenario.trim() : '';
    const questionCount = clampQuestionCount(body.questionCount);
    const locale = body.locale === 'zh' ? 'zh' : 'en';

    let content = '';

    try {
      const languageRule = locale === 'zh'
        ? 'Reply in Chinese. Keep the structure compact and clear.'
        : 'Reply in English. Keep the structure compact and clear.';
      const modeLabel = mode === 'written' ? 'written test' : 'mock interview';

      content = await createBigModelChatCompletion([
        {
          role: 'system',
          content:
            `You generate realistic ${modeLabel} materials for students and early-career candidates. Use the same career-coach standards as the chat assistant. No markdown tables. Avoid generic questions. Each question must be tailored to the role, level, company style, focus area, and scenario. Include what the reviewer is testing and what a strong answer should contain. ${languageRule}`,
        },
        {
          role: 'user',
          content: `Create a custom ${modeLabel} practice set.

Role: ${role || 'general candidate'}
Company style: ${company || 'general tech company'}
Level: ${level || 'intern'}
Difficulty: ${difficulty}
Focus area: ${focus || 'core role skills'}
Scenario: ${scenario || 'realistic hiring assessment'}
Question count: ${questionCount}

For a mock interview, include opening question, role-specific technical or case questions, behavioral probes, follow-up probes, and a scoring rubric.
For a written test, include practical tasks, time expectations, expected answer shape, evaluation criteria, and one stretch question.
Make it feel like a real hiring loop, not a generic study list.`,
        },
      ]);
    } catch {
      content = '';
    }

    return NextResponse.json({
      success: true,
      data: {
        mode,
        content: content || buildFallback(mode, role, company, level, focus, difficulty, questionCount, scenario),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to generate practice set.' },
      { status: 500 },
    );
  }
}

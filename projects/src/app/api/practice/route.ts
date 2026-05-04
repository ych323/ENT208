import { NextRequest, NextResponse } from 'next/server';
import { createBigModelChatCompletion } from '@/lib/bigmodel';

type PracticeMode = 'interview' | 'written';

function buildFallback(mode: PracticeMode, role: string, company: string, level: string, focus: string) {
  const roleLabel = role || 'general product and engineering roles';
  const companyLabel = company || 'a realistic hiring team';
  const focusLabel = focus || 'core problem solving, communication, and evidence from past work';
  const levelLabel = level || 'intern';

  if (mode === 'written') {
    return [
      `Written test set for ${levelLabel} ${roleLabel} candidates targeting ${companyLabel}.`,
      `Question 1. Explain how you would approach ${focusLabel} in a time-boxed written assessment and what assumptions you would state first.`,
      `Question 2. You receive incomplete product or technical requirements. Write the structure you would use to clarify scope, constraints, and tradeoffs before implementation.`,
      `Question 3. Describe a representative project or case and quantify the impact, quality bar, and limits of your contribution.`,
      `Question 4. Analyze a failure scenario related to ${roleLabel} work. Identify root cause, what metric would move first, and how you would verify a fix.`,
      `Question 5. Draft a short prioritization answer that shows judgment, communication, and decision logic under pressure.`,
      `Review rubric. Accuracy, structure, signal density, tradeoff awareness, and role relevance.`,
    ].join('\n\n');
  }

  return [
    `Mock interview loop for a ${levelLabel} ${roleLabel} candidate targeting ${companyLabel}.`,
    `Warm-up. Tell me about yourself in ninety seconds with emphasis on evidence that proves fit for ${roleLabel}.`,
    `Question 1. Walk through a project that best demonstrates ${focusLabel}. I will probe for scope, ownership, and measurable outcome.`,
    `Question 2. Tell me about a tradeoff or failure. I will look for judgment, reflection, and what changed in your process afterward.`,
    `Question 3. Why this role, and why now? I will test whether your story is precise rather than generic.`,
    `Question 4. What gap in your background would worry a hiring manager most, and how would you reduce that risk in the next four weeks?`,
    `Scoring rubric. Clarity, evidence, structured thinking, role fit, and follow-through.`,
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

    let content = '';

    try {
      content = await createBigModelChatCompletion([
        {
          role: 'system',
          content:
            'You generate realistic mock interview and written-test materials for students and early-career candidates. Reply in plain English only. No markdown bullets, no headings, no tables. Write compact short paragraphs and number the questions inline with plain text if needed.',
        },
        {
          role: 'user',
          content: `Create a ${mode} practice set for role: ${role || 'general candidate'}; company target: ${company || 'general tech company'}; level: ${level || 'intern'}; focus: ${focus || 'core role skills'}.

Include 5 realistic questions and a short reviewer rubric. Make it sound like an actual hiring loop.`,
        },
      ]);
    } catch {
      content = '';
    }

    return NextResponse.json({
      success: true,
      data: {
        mode,
        content: content || buildFallback(mode, role, company, level, focus),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to generate practice set.' },
      { status: 500 },
    );
  }
}

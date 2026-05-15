import { NextRequest, NextResponse } from 'next/server';
import { createBigModelChatCompletion } from '@/lib/bigmodel';
import { findJobById } from '@/lib/jobs-data';
import { getOnboarding, getResumeWorkspace } from '@/lib/workspace-db';

function getUserKey(request: NextRequest) {
  return request.headers.get('x-user-key') || request.headers.get('x-client-id') || 'anonymous';
}

function buildFallbackScore(input: string) {
  const normalized = input.toLowerCase();
  let score = 56;
  if (/(react|typescript|frontend|ui|css|javascript)/.test(normalized)) score += 12;
  if (/(java|go|backend|api|distributed|sql)/.test(normalized)) score += 12;
  if (/(machine learning|ml|python|data|analytics|product)/.test(normalized)) score += 10;
  return Math.min(score, 86);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userKey = getUserKey(request);
    const onboarding = await getOnboarding(userKey);
    const workspace = await getResumeWorkspace(userKey);
    const job = typeof body.job_id === 'string' ? await findJobById(body.job_id) : null;

    const roleTitle = typeof body.title === 'string' ? body.title : job?.title || 'Target role';
    const company = typeof body.company === 'string' ? body.company : job?.company || 'Target company';
    const roleContext = [
      roleTitle,
      company,
      typeof body.location === 'string' ? body.location : job?.location || '',
      job?.tags || '',
      job?.description || '',
      job?.requirements || '',
    ]
      .filter(Boolean)
      .join('\n');

    const candidateContext = [
      onboarding?.answers ? JSON.stringify(onboarding.answers) : '',
      workspace?.summary || '',
      workspace?.skills?.join(', ') || '',
      workspace?.experience?.map((item) => `${item.title} at ${item.company}: ${item.bullets.join('; ')}`).join('\n') || '',
      typeof body.notes === 'string' ? body.notes : '',
    ]
      .filter(Boolean)
      .join('\n');

    const fallbackScore = buildFallbackScore(`${roleContext}\n${candidateContext}`);
    let parsed = null as null | {
      score: number;
      summary: string;
      strengths: string[];
      gaps: string[];
      next_steps: string[];
    };

    try {
      const raw = await createBigModelChatCompletion([
        {
          role: 'system',
          content:
            'You are a job-fit evaluator. Return strict JSON only with keys score, summary, strengths, gaps, next_steps. score must be an integer from 0 to 100. Keep summary under 45 words. Each list should have exactly 3 short strings.',
        },
        {
          role: 'user',
          content: `Evaluate job fit.

Role context:
${roleContext}

Candidate context:
${candidateContext || 'No extra candidate context provided.'}`,
        },
      ]);

      parsed = JSON.parse(raw) as typeof parsed;
    } catch {
      parsed = null;
    }

    return NextResponse.json({
      success: true,
      data: parsed
        ? {
            score: Math.max(0, Math.min(100, Math.round(parsed.score))),
            summary: parsed.summary,
            strengths: parsed.strengths,
            gaps: parsed.gaps,
            next_steps: parsed.next_steps,
          }
        : {
            score: fallbackScore,
            summary: `Current evidence suggests a moderate fit for ${roleTitle} with room to tighten role-specific proof.`,
            strengths: [
              'Baseline profile is specific enough to evaluate against a real role.',
              'There is likely at least one transferable project or skill cluster.',
              'The role can be narrowed into concrete next application steps.',
            ],
            gaps: [
              'Resume evidence is still lighter than a strong direct match would require.',
              'Impact metrics and ownership details need to be more explicit.',
              'Role-targeted keywords and examples are not fully sharpened yet.',
            ],
            next_steps: [
              'Rewrite one project bullet with scope, stack, and measurable outcome.',
              'Save the job into the tracker and update the target status weekly.',
              'Run one interview or written-test simulation for this exact role.',
            ],
          },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to analyze fit.' },
      { status: 500 },
    );
  }
}

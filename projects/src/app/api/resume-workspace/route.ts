import { NextRequest, NextResponse } from 'next/server';
import { generateAwesomeCvLatex } from '@/lib/resume-awesome-cv';
import { getResumeWorkspace, upsertResumeWorkspace } from '@/lib/workspace-db';

function getUserKey(request: NextRequest) {
  return request.headers.get('x-user-key') || request.headers.get('x-client-id') || 'anonymous';
}

export async function GET(request: NextRequest) {
  const record = await getResumeWorkspace(getUserKey(request));
  return NextResponse.json({ success: true, data: record });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const locale = body.locale === 'zh' ? 'zh' : 'en';
    const skills = Array.isArray(body.skills) ? body.skills.filter((item: unknown) => typeof item === 'string') : [];
    const experience = Array.isArray(body.experience) ? body.experience : [];
    const education = Array.isArray(body.education) ? body.education : [];

    const latex = generateAwesomeCvLatex({
      full_name: typeof body.full_name === 'string' ? body.full_name : '',
      role_title: typeof body.role_title === 'string' ? body.role_title : '',
      email: typeof body.email === 'string' ? body.email : '',
      phone: typeof body.phone === 'string' ? body.phone : '',
      location: typeof body.location === 'string' ? body.location : '',
      website: typeof body.website === 'string' ? body.website : '',
      linkedin: typeof body.linkedin === 'string' ? body.linkedin : '',
      github: typeof body.github === 'string' ? body.github : '',
      summary: typeof body.summary === 'string' ? body.summary : '',
      skills,
      selected_focus: typeof body.selected_focus === 'string' ? body.selected_focus : '',
      experience,
      projects: Array.isArray(body.projects) ? body.projects : [],
      education,
      certifications: Array.isArray(body.certifications) ? body.certifications.filter((item: unknown) => typeof item === 'string') : [],
    });

    const record = await upsertResumeWorkspace({
      id: typeof body.id === 'string' ? body.id : undefined,
      user_key: getUserKey(request),
      locale,
      full_name: typeof body.full_name === 'string' ? body.full_name : '',
      role_title: typeof body.role_title === 'string' ? body.role_title : '',
      email: typeof body.email === 'string' ? body.email : '',
      phone: typeof body.phone === 'string' ? body.phone : '',
      location: typeof body.location === 'string' ? body.location : '',
      website: typeof body.website === 'string' ? body.website : '',
      linkedin: typeof body.linkedin === 'string' ? body.linkedin : '',
      github: typeof body.github === 'string' ? body.github : '',
      summary: typeof body.summary === 'string' ? body.summary : '',
      skills,
      selected_focus: typeof body.selected_focus === 'string' ? body.selected_focus : '',
      experience,
      projects: Array.isArray(body.projects) ? body.projects : [],
      education,
      certifications: Array.isArray(body.certifications) ? body.certifications.filter((item: unknown) => typeof item === 'string') : [],
      latex,
    });

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to save resume workspace.' },
      { status: 500 },
    );
  }
}

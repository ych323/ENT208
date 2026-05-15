import { NextRequest, NextResponse } from 'next/server';
import { findJobById, getJobCatalog } from '@/lib/jobs-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const job = await findJobById(id);

    if (!job) {
      return NextResponse.json({ success: false, error: 'Position not found' }, { status: 404 });
    }

    const jobs = await getJobCatalog();
    const relatedJobs = jobs
      .filter(
        (candidate) =>
          candidate.id !== id &&
          candidate.status === 'active' &&
          (candidate.category === job.category || candidate.company === job.company),
      )
      .slice(0, 6)
      .map(({ id: relatedId, title, company, location, salary_text, category }) => ({
        id: relatedId,
        title,
        company,
        location,
        salary_text,
        category,
      }));

    return NextResponse.json({
      success: true,
      data: {
        ...job,
        views: job.views + 1,
      },
      relatedJobs,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch job detail' },
      { status: 500 },
    );
  }
}

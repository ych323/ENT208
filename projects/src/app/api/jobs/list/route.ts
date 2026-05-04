import { NextRequest, NextResponse } from 'next/server';
import { addManualJob, getJobCatalog, type JobCategory } from '@/lib/jobs-data';

function normalizeCategory(value?: string | null) {
  const validCategories: JobCategory[] = [
    'frontend',
    'backend',
    'algorithm',
    'data',
    'product',
    'operation',
    'design',
    'devops',
    'mobile',
    'qa',
  ];

  return value && validCategories.includes(value as JobCategory) ? (value as JobCategory) : null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const company = searchParams.get('company');
    const category = normalizeCategory(searchParams.get('category'));
    const jobType = searchParams.get('jobType');
    const location = searchParams.get('location');
    const keyword = searchParams.get('keyword');
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
    const pageSize = Math.max(parseInt(searchParams.get('pageSize') || '20', 10), 1);

    let jobs = (await getJobCatalog()).filter((job) => job.status === 'active');

    if (company) {
      const query = company.toLowerCase();
      jobs = jobs.filter((job) => job.company.toLowerCase().includes(query));
    }

    if (category) {
      jobs = jobs.filter((job) => job.category === category);
    }

    if (jobType && jobType !== 'all') {
      jobs = jobs.filter((job) => job.job_type === jobType);
    }

    if (location) {
      const query = location.toLowerCase();
      jobs = jobs.filter((job) => job.location.toLowerCase().includes(query));
    }

    if (keyword) {
      const query = keyword.toLowerCase();
      jobs = jobs.filter((job) =>
        `${job.title} ${job.company} ${job.category} ${job.tags ?? ''} ${job.description ?? ''}`
          .toLowerCase()
          .includes(query),
      );
    }

    const total = jobs.length;
    const start = (page - 1) * pageSize;
    const data = jobs.slice(start, start + pageSize);

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
      meta: {
        dataSource: 'remote-aggregated',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch jobs' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const job = addManualJob({
      title: body.title,
      company: body.company,
      location: body.location,
      salary_text: body.salary_text,
      category: normalizeCategory(body.category) ?? 'backend',
      tags: body.tags,
      description: body.description,
      requirements: body.requirements,
      responsibilities: body.responsibilities,
      job_type: body.job_type === 'internship' ? 'internship' : 'fulltime',
      education: body.education,
      experience: body.experience,
      official_url: body.official_url,
      publish_date: body.publish_date,
    });

    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create job' },
      { status: 400 },
    );
  }
}

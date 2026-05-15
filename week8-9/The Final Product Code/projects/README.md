# Reachable

Reachable is an AI career positioning platform for students and early-career candidates. It helps users understand role fit, analyze resumes, explore real jobs, practice interviews, track applications, and learn from a career community.

## Live Demo

The project is deployed on Vercel:

https://reachable-dxidamt6k-kunkunking66-8740s-projects.vercel.app/

## Main Features

- AI career positioning chat powered by Zhipu BigModel.
- Resume upload and AI-generated career fit analysis.
- Real job explorer with search, filters, job detail pages, official application links, and job fit analysis.
- Application tracker for saved, applied, interviewing, offer, and rejected roles.
- Practice studio for customized mock interview and written-test questions.
- Resume workspace based on the Awesome CV LaTeX template.
- Forum with preset content plus user posts and comments.
- Resource center with curated learning resources across frontend, backend, AI, data, product, design, operations, QA, mobile, and DevOps.

## Tech Stack

- Framework: Next.js 16 App Router
- UI: React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Radix UI
- AI: Zhipu BigModel API
- Database: Supabase Free tier for deployed shared data
- Package manager: pnpm

## Deployment

The production deployment uses:

- Vercel for hosting
- Supabase for authentication and shared database storage
- Zhipu BigModel for AI chat, resume analysis, mock interview, and written-test generation

Required Vercel environment variables:

```env
BIGMODEL_API_KEY=your_bigmodel_api_key
BIGMODEL_MODEL=glm-5.1
BIGMODEL_BASE_URL=https://open.bigmodel.cn/api/paas/v4

COZE_SUPABASE_URL=your_supabase_project_url
COZE_SUPABASE_ANON_KEY=your_supabase_anon_key
COZE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Before deploying, run the SQL script in Supabase:

```text
supabase/schema.sql
```

Vercel project settings:

```text
Root Directory: projects
Framework Preset: Next.js
Install Command: pnpm install
Build Command: pnpm next build
Output Directory: .next
```

## Local Development

Install dependencies:

```bash
pnpm install
```

Create a local environment file:

```bash
cp .env.local.example .env.local
```

Start the development server:

```bash
pnpm dev
```

On Windows:

```powershell
pnpm dev:win
```

Local URL:

```text
http://localhost:5000
```

## Important Routes

```text
/                       English home
/zh                     Chinese home
/en/chat                AI positioning chat
/en/jobs                Job explorer
/en/jobs/tracker        Application tracker
/en/practice            Mock interview and written test generator
/en/resume-workspace    Resume workspace
/en/forum               Forum
/en/resources           Resource center
```

## API Overview

```text
POST /api/chat                 AI chat
POST /api/resume               Resume parsing and analysis
GET  /api/jobs/list            Job list
GET  /api/jobs/[id]            Job detail
POST /api/job-fit              Job fit analysis
GET  /api/forum/posts          Forum posts
POST /api/forum/posts          Create forum post
POST /api/forum/comments       Create forum comment
POST /api/practice             Generate interview or written-test set
GET  /api/resources            Learning resources
```

## Notes

For local development, the app can fall back to local file storage. For public deployment, Supabase environment variables should be configured so user accounts, forum posts, comments, tracker data, onboarding answers, and resume workspace data persist across users.

## License

MIT

# Vercel + Supabase Free Deployment

## 1. Create Supabase

Create a free Supabase project, then open the SQL editor and run:

```text
supabase/schema.sql
```

Copy these values from Supabase:

```text
Project URL
anon public key
service_role key
```

## 2. Deploy on Vercel

Import this GitHub repository in Vercel:

```text
https://github.com/ych323/ENT208
```

Use these project settings:

```text
Root Directory: projects
Framework Preset: Next.js
Install Command: pnpm install
Build Command: pnpm next build
Output Directory: .next
```

## 3. Environment Variables

Set these in Vercel:

```text
BIGMODEL_API_KEY=your_zhipu_key
BIGMODEL_MODEL=glm-5.1
BIGMODEL_BASE_URL=https://open.bigmodel.cn/api/paas/v4
COZE_SUPABASE_URL=your_supabase_project_url
COZE_SUPABASE_ANON_KEY=your_supabase_anon_key
COZE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

After deployment, registration uses Supabase Auth and forum posts, comments, tracker data, onboarding, and resume workspace data use Supabase tables.

# Reachable / 够得着

> AI Career Ability Locator - Help students discover their ability position, find job directions, and bridge skill gaps

## Overview

Reachable is an intelligent career assistant designed for students and graduates, using AI conversational interaction to help users:

- Generate 6-dimensional ability profiles (technical skills, project experience, industry knowledge, communication, internships, learning potential)
- Match with 20+ real job positions based on RAG technology
- Get personalized growth plans and improvement paths
- Support resume upload or manual background description
- **Career Forum** - Share interview experiences and career insights
- **Learning Library** - Carefully curated learning paths and quality resources

## Core Features

| Feature | Description |
|---------|-------------|
| Conversational Ability Profile | Collect background through natural dialogue, generate 6-dimensional ability assessment |
| RAG Job Matching | Based on 20+ real job data, recommend Safe/Stretch/Dream positions |
| Personalized Growth Plan | Generate actionable skill learning paths for target positions |
| Career Forum | Interview experience sharing, job discussions, study check-ins, job help |
| Learning Library | Frontend/Backend/Algorithm/Interview quality resources |

## Tech Stack

```
Frontend: Next.js 16 + React 19 + TypeScript + shadcn/ui + Tailwind CSS 4
Backend: Next.js API Routes
Database: Supabase PostgreSQL
AI Engine: Zhipu GLM-5 (Streaming Conversation)
RAG Technology: Vector Database + Semantic Search (coze-coding-dev-sdk)
```

## Local Development

### Requirements

- Node.js 18+
- pnpm 9+

### Quick Start

#### macOS / Linux

```bash
# Install dependencies
pnpm install

# Configure environment variables
cp .env.local.example .env.local
# Edit .env.local, add your Zhipu API Key

# Start development server
pnpm dev
```

#### Windows

```powershell
# Install dependencies
pnpm install

# Configure environment variables
copy .env.local.example .env.local
# Edit .env.local, add your Zhipu API Key

# Start development server
pnpm dev:win
```

### Environment Variables

Create `.env.local` file with required configuration:

```bash
# Zhipu AI Configuration (Required)
ZHIPU_API_KEY=your_zhipu_api_key
ZHIPU_BASE_URL=https://www.aiping.cn/api/v1
ZHIPU_MODEL=GLM-5
```

Get Zhipu API Key: https://open.bigmodel.cn/

### Access URLs

| Page | URL |
|------|-----|
| Home (English) | http://localhost:5000 |
| Home (Chinese) | http://localhost:5000/zh |
| Forum | http://localhost:5000/en/forum |
| Learning Resources | http://localhost:5000/en/resources |

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home (English)
│   ├── zh/page.tsx               # Home (Chinese)
│   ├── en/                       # English pages
│   │   ├── page.tsx            # English home
│   │   ├── forum/              # English forum
│   │   │   ├── page.tsx       # Forum home
│   │   │   └── [id]/page.tsx  # Post detail
│   │   └── resources/           # English resources
│   │       └── page.tsx
│   ├── forum/                    # Chinese forum pages
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── resources/                # Chinese resources pages
│   │   └── page.tsx
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   └── api/                      # API Routes
│       ├── chat/route.ts         # Chat API
│       ├── resume/route.ts       # Resume upload
│       ├── forum/                # Forum API
│       │   ├── posts/route.ts   # Post list/create
│       │   ├── posts/[id]/route.ts # Post detail
│       │   └── comments/route.ts  # Comments
│       ├── jobs/                 # Job API
│       │   ├── search/route.ts   # Job search
│       │   └── import/route.ts   # Job import
│       └── resources/route.ts    # Learning resources API
├── components/                   # React Components
│   ├── ui/                       # shadcn/ui base components
│   ├── LandingPage.tsx          # Chinese Landing Page
│   └── chat/                     # Chat components
└── storage/                      # Database related
    └── database/                 # Supabase config
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | AI Chat (SSE Streaming) |
| `/api/resume` | POST | Resume File Upload |
| `/api/jobs/search` | POST | Job Semantic Search (RAG) |
| `/api/forum/posts` | GET/POST | Get/Create Posts |
| `/api/forum/posts/[id]` | GET | Get Post Detail |
| `/api/forum/comments` | POST | Add Comment |
| `/api/resources` | GET/POST | Get/Add Learning Resources |

## Forum Categories

| Category | Content |
|----------|---------|
| Interview Experience | Interview sharing, questions, salary |
| Job Discussion | Job responsibilities, prospects, industry analysis |
| Study Check-in | Learning plans, daily check-ins, mutual supervision |
| Job Help | referrals, resume reviews, offer comparisons |

## Included Job Positions

Covers 20+ real positions from companies including ByteDance, Alibaba, Tencent, Meituan, Baidu, Xiaomi, Didi, NetEase, Bilibili, Kuaishou, Huawei, Ant Group, Pinduoduo, SenseTime, etc.

## Learning Resource Categories

| Category | Content |
|----------|---------|
| Frontend | Learning paths, MDN docs, React, Vue, TypeScript |
| Backend | Java/Go, Spring Boot, Database, Redis |
| Algorithm | Code Thoughts, labuladong, LeetCode hot problems |
| Interview | Cracking the Coding Interview, Nowcoder experiences |

## Technical Highlights

### 1. RAG Retrieval Augmentation

Semantic search based on vector database, matching real job data.

### 2. Streaming Conversation

Typewriter-style output using SSE protocol for better user experience.

### 3. Step-by-step Conversation Control

Strict conversation pacing, one thing at a time.

### 4. Community Features

Backend storage based on Supabase, supporting forum posts and comments.

## Build & Deploy

### Build

```bash
pnpm build
```

### Start Production Server

```bash
# macOS / Linux
pnpm start

# Windows
pnpm start:win
```

## Development Guidelines

### Package Manager

**Must use pnpm**:

```bash
# Correct
pnpm add package-name

# Wrong
npm install package-name
yarn add package-name
```

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Zhipu AI Open Platform](https://open.bigmodel.cn/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

## License

MIT

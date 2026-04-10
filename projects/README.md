# 够得着 / Reachable

> AI求职能力定位器 — 帮助大学生看清能力位置、找到岗位方向、补上能力差距

## 项目简介

够得着是一个专为大学生设计的智能求职助手，通过AI对话式交互，帮助用户：

- 生成六维能力画像（技术硬技能、项目经验、行业认知、沟通表达、实习经历、学习潜力）
- 基于RAG技术匹配20+真实岗位数据
- 获得个性化成长计划和提升路径
- 支持简历上传或手动描述背景
- **求职论坛** - 分享面试经历、交流求职心得
- **学习资源库** - 精心整理的学习路线和优质资源

## 核心功能

| 功能 | 说明 |
|------|------|
| 对话式能力画像 | 通过自然对话采集背景，生成六维能力评估 |
| RAG岗位匹配 | 基于20+真实岗位数据，推荐稳拿/冲刺/梦想三类岗位 |
| 个性化成长计划 | 针对目标岗位生成可执行的技能学习路径 |
| 求职论坛 | 面试经验分享、岗位讨论、学习打卡、求职互助 |
| 学习资源库 | 前端/后端/算法/面试优质资源聚合 |

## 技术架构

```
前端：Next.js 16 + React 19 + TypeScript + shadcn/ui + Tailwind CSS 4
后端：Next.js API Routes
数据库：Supabase PostgreSQL
AI引擎：智谱GLM-5（流式对话）
RAG技术：向量数据库 + 语义搜索（coze-coding-dev-sdk）
```

## 本地开发

### 环境要求

- Node.js 18+
- pnpm 9+

### 快速启动

#### macOS / Linux

```bash
# 安装依赖
pnpm install

# 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local，填入你的智谱API Key

# 启动开发服务器
pnpm dev
```

#### Windows

```powershell
# 安装依赖
pnpm install

# 配置环境变量
copy .env.local.example .env.local
# 编辑 .env.local，填入你的智谱API Key

# 启动开发服务器
pnpm dev:win
```

### 环境变量配置

创建 `.env.local` 文件，必需配置：

```bash
# 智谱AI配置（必需）
ZHIPU_API_KEY=你的智谱API密钥
ZHIPU_BASE_URL=https://www.aiping.cn/api/v1
ZHIPU_MODEL=GLM-5
```

获取智谱API Key：https://open.bigmodel.cn/

### 访问地址

| 页面 | 地址 |
|------|------|
| 首页 | http://localhost:5000 |
| 论坛 | http://localhost:5000/forum |
| 学习资源 | http://localhost:5000/resources |

## 项目结构

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 首页
│   ├── layout.tsx                # 根布局
│   ├── globals.css               # 全局样式
│   ├── forum/                    # 论坛页面
│   │   ├── page.tsx             # 论坛首页
│   │   └── [id]/page.tsx       # 帖子详情
│   ├── resources/                # 学习资源页面
│   │   └── page.tsx            # 资源列表
│   └── api/                      # API路由
│       ├── chat/route.ts         # 对话API
│       ├── resume/route.ts       # 简历上传
│       ├── forum/                # 论坛API
│       │   ├── posts/route.ts   # 帖子列表/创建
│       │   ├── posts/[id]/route.ts # 帖子详情
│       │   └── comments/route.ts  # 评论
│       ├── jobs/                 # 岗位API
│       │   ├── search/route.ts   # 岗位搜索
│       │   └── import/route.ts   # 岗位导入
│       └── resources/route.ts    # 学习资源API
├── components/                   # React组件
│   ├── ui/                       # shadcn/ui基础组件
│   ├── LandingPage.tsx          # 首页落地页
│   └── chat/                     # 聊天组件
└── storage/                      # 数据库相关
    └── database/                 # Supabase配置
```

## API接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/chat` | POST | AI对话（SSE流式输出） |
| `/api/resume` | POST | 简历文件上传 |
| `/api/jobs/search` | POST | 岗位语义搜索（RAG） |
| `/api/forum/posts` | GET/POST | 获取/创建帖子 |
| `/api/forum/posts/[id]` | GET | 获取帖子详情 |
| `/api/forum/comments` | POST | 添加评论 |
| `/api/resources` | GET/POST | 获取/添加学习资源 |

## 论坛板块

| 板块 | 内容 |
|------|------|
| 面试经验 | 面经分享、题目回忆、薪资待遇 |
| 岗位讨论 | 岗位职责、发展前景、行业分析 |
| 学习打卡 | 学习计划、每日打卡、互相监督 |
| 求职互助 | 内推信息、简历修改、offer比较 |

## 已收录岗位

涵盖20+真实岗位，来自字节跳动、阿里巴巴、腾讯、美团、百度、小米、滴滴、网易、哔哩哔哩、快手、华为、蚂蚁集团、拼多多、商汤科技等公司。

## 学习资源分类

| 分类 | 内容 |
|------|------|
| 前端 | 学习路线、MDN文档、React、Vue、TypeScript |
| 后端 | Java/Go、Spring Boot、数据库、Redis |
| 算法 | 代码随想录、labuladong、LeetCode热题 |
| 面试 | 程序员面试金典、牛客网面经 |

## 技术亮点

### 1. RAG检索增强

基于向量数据库的语义搜索，匹配真实岗位数据。

### 2. 流式对话

使用SSE协议实现打字机式输出，提升用户体验。

### 3. 分步对话控制

严格的对话节奏控制，每轮只做一件事。

### 4. 社区功能

基于Supabase的后端存储，支持论坛帖子和评论。

## 构建与部署

### 构建

```bash
pnpm build
```

### 启动生产服务器

```bash
# macOS / Linux
pnpm start

# Windows
pnpm start:win
```

## 开发规范

### 包管理器

**必须使用 pnpm**：

```bash
# 正确
pnpm add package-name

# 错误
npm install package-name
yarn add package-name
```

## 参考文档

- [Next.js 官方文档](https://nextjs.org/docs)
- [shadcn/ui 组件文档](https://ui.shadcn.com)
- [智谱AI开放平台](https://open.bigmodel.cn/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Supabase 文档](https://supabase.com/docs)

## License

MIT

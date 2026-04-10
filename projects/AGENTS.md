# 够得着 - AI求职能力定位器

## 项目简介

AI求职能力定位器，通过对话式交互帮助大学生完成能力画像、岗位匹配和成长规划。

## 核心功能

1. **智能对话**：基于智谱GLM-5模型的对话式交互（流式响应）
2. **岗位匹配**：基于RAG技术，20+真实岗位数据智能推荐
3. **能力定位**：六维能力画像（技术硬技能、项目经验、行业认知、沟通表达、实习经历、学习潜力）
4. **成长规划**：针对目标岗位生成个性化提升计划

## API 接口

| 路径 | 方法 | 功能 |
|------|------|------|
| `/api/chat` | POST | 对话接口（SSE流式响应） |
| `/api/resume` | POST | 简历文件上传 |
| `/api/jobs/search` | POST | 岗位语义搜索（RAG） |
| `/api/jobs/import` | POST | 岗位数据导入 |

## 技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4
- **AI引擎**: 智谱GLM-5
- **RAG**: coze-coding-dev-sdk（向量数据库 + 语义搜索）

## 目录结构

```
├── public/                 # 静态资源
├── scripts/                # 构建与启动脚本
├── src/
│   ├── app/                # 页面路由与布局
│   │   ├── page.tsx        # 首页
│   │   ├── layout.tsx      # 根布局
│   │   ├── globals.css     # 全局样式
│   │   └── api/            # API路由
│   │       ├── chat/       # 对话API
│   │       ├── resume/     # 简历上传API
│   │       └── jobs/       # 岗位相关API
│   ├── components/         # React组件
│   │   ├── ui/             # shadcn/ui基础组件
│   │   ├── LandingPage.tsx # 首页落地页
│   │   └── chat/           # 聊天相关组件
│   ├── lib/                # 工具函数
│   └── types/              # TypeScript类型定义
├── next.config.ts          # Next.js 配置
├── package.json            # 项目依赖管理
└── tsconfig.json           # TypeScript 配置
```

## 包管理规范

**仅允许使用 pnpm** 作为包管理器，**严禁使用 npm 或 yarn**。

常用命令：
- 安装依赖：`pnpm install`
- 添加依赖：`pnpm add <package>`
- 开发依赖：`pnpm add -D <package>`
- 移除依赖：`pnpm remove <package>`

## 开发规范

- **Hydration 错误预防**：严禁在 JSX 渲染逻辑中直接使用 typeof window、Date.now()、Math.random() 等动态数据。必须使用 'use client' 并配合 useEffect + useState 确保动态内容仅在客户端挂载后渲染；同时严禁非法 HTML 嵌套（如 <p> 嵌套 <div>）。

## UI 设计规范

- 默认使用 shadcn/ui 组件库，位于 `src/components/ui/` 目录下
- 使用 Tailwind CSS + cn() 工具函数进行样式开发

## 已知问题

| 问题 | 状态 | 解决方案 |
|------|------|----------|
| PDF简历解析 | 本地环境兼容性问题 | 建议用户手动描述简历内容 |

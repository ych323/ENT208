// 消息类型
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// 会话状态
export type ConversationStage = 
  | 'intro'           // 开场白
  | 'collecting'      // 信息采集中
  | 'profile'         // 能力画像展示
  | 'matching'        // 岗位匹配
  | 'planning'        // 成长计划
  | 'completed';      // 完成

// 用户信息
export interface UserInfo {
  major?: string;
  degree?: string;
  skills?: string[];
  projects?: string[];
  internships?: string[];
  interests?: string[];
  stage?: string;
}

// 能力维度
export interface AbilityDimension {
  name: string;
  score: number;
  comment: string;
}

// 能力画像
export interface AbilityProfile {
  dimensions: AbilityDimension[];
  strengths: string[];
  weaknesses: string[];
  summary: string;
}

// 岗位信息
export interface JobInfo {
  title: string;
  exampleCompanies: string[];
  matchRate: number;
  matchedSkills: string[];
  missingSkills: string[];
  reason: string;
}

// 岗位匹配结果
export interface JobMatchingResult {
  safeJobs: JobInfo[];      // 稳拿型
  stretchJobs: JobInfo[];   // 冲刺型
  dreamJobs: JobInfo[];     // 梦想型
}

// 学习资源
export interface LearningResource {
  name: string;
  type: string;
  url?: string;
  cost: string;
}

// 技能计划
export interface SkillPlan {
  skill: string;
  resources: LearningResource[];
  estimatedTime: string;
}

// 项目建议
export interface ProjectSuggestion {
  name: string;
  description: string;
  skillsCovered: string[];
  difficulty: string;
}

// 时间线阶段
export interface TimelinePhase {
  weekRange: string;
  focus: string;
  tasks: string[];
}

// 成长计划
export interface GrowthPlan {
  skillPlan: SkillPlan[];
  projectSuggestions: ProjectSuggestion[];
  experienceAdvice: string[];
  timeline: {
    totalWeeks: number;
    phases: TimelinePhase[];
  };
  expectedImprovement: {
    from: number;
    to: number;
    note: string;
  };
}

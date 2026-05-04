import { pgTable, varchar, timestamp, text, integer, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// ==================== 论坛帖子表 ====================
export const forumPosts = pgTable(
  "forum_posts",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    author: varchar("author", { length: 50 }).notNull().default("匿名用户"),
    title: varchar("title", { length: 200 }).notNull(),
    content: text("content").notNull(),
    category: varchar("category", { length: 50 }).notNull().default("面试经验"), // 面试经验/岗位讨论/学习打卡/求职互助
    tags: varchar("tags", { length: 200 }), // 逗号分隔的标签
    target_job: varchar("target_job", { length: 100 }),
    company: varchar("company", { length: 100 }),
    views: integer("views").notNull().default(0),
    likes: integer("likes").notNull().default(0),
    comments_count: integer("comments_count").notNull().default(0),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("forum_posts_category_idx").on(table.category),
    index("forum_posts_created_at_idx").on(table.created_at),
    index("forum_posts_likes_idx").on(table.likes),
  ]
);

// ==================== 论坛评论表 ====================
export const forumComments = pgTable(
  "forum_comments",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    post_id: varchar("post_id", { length: 36 }).notNull().references(() => forumPosts.id, { onDelete: "cascade" }),
    author: varchar("author", { length: 50 }).notNull().default("匿名用户"),
    content: text("content").notNull(),
    likes: integer("likes").notNull().default(0),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("forum_comments_post_id_idx").on(table.post_id),
    index("forum_comments_created_at_idx").on(table.created_at),
  ]
);

// ==================== 论坛帖子点赞表 ====================
export const forumPostLikes = pgTable(
  "forum_post_likes",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    post_id: varchar("post_id", { length: 36 }).notNull().references(() => forumPosts.id, { onDelete: "cascade" }),
    user_id: varchar("user_id", { length: 100 }).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("forum_post_likes_post_id_idx").on(table.post_id),
    index("forum_post_likes_user_id_idx").on(table.user_id),
    index("forum_post_likes_post_user_idx").on(table.post_id, table.user_id),
  ]
);

// ==================== 论坛评论点赞表 ====================
export const forumCommentLikes = pgTable(
  "forum_comment_likes",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    comment_id: varchar("comment_id", { length: 36 }).notNull().references(() => forumComments.id, { onDelete: "cascade" }),
    user_id: varchar("user_id", { length: 100 }).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("forum_comment_likes_comment_id_idx").on(table.comment_id),
    index("forum_comment_likes_user_id_idx").on(table.user_id),
    index("forum_comment_likes_comment_user_idx").on(table.comment_id, table.user_id),
  ]
);

// ==================== 学习资源表 ====================
export const learningResources = pgTable(
  "learning_resources",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description"),
    category: varchar("category", { length: 50 }).notNull(), // 前端/后端/算法/工具/面试
    sub_category: varchar("sub_category", { length: 100 }), // 子分类，如：React/Vue, Java/Python
    type: varchar("type", { length: 20 }).notNull().default("article"), // article/video/course/book/project
    url: varchar("url", { length: 500 }),
    level: varchar("level", { length: 20 }).default("all"), // 入门/进阶/高级/all
    tags: varchar("tags", { length: 200 }), // 逗号分隔的标签
    likes: integer("likes").notNull().default(0),
    views: integer("views").notNull().default(0),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("learning_resources_category_idx").on(table.category),
    index("learning_resources_type_idx").on(table.type),
    index("learning_resources_level_idx").on(table.level),
  ]
);

// ==================== 岗位信息表 ====================
export const jobs = pgTable(
  "jobs",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    title: varchar("title", { length: 200 }).notNull(),           // 岗位名称
    company: varchar("company", { length: 100 }).notNull(),       // 公司名称
    company_logo: varchar("company_logo", { length: 500 }),       // 公司Logo URL
    location: varchar("location", { length: 100 }),               // 工作地点
    salary_min: integer("salary_min"),                            // 薪资下限（月薪，单位K）
    salary_max: integer("salary_max"),                            // 薪资上限（月薪，单位K）
    salary_text: varchar("salary_text", { length: 100 }),         // 薪资描述（如"20k-35k"）
    category: varchar("category", { length: 50 }).notNull(),      // 岗位大类：前端/后端/算法/运营/产品/数据
    tags: varchar("tags", { length: 200 }),                       // 技能标签，逗号分隔
    description: text("description"),                              // 岗位描述
    requirements: text("requirements"),                           // 任职要求
    responsibilities: text("responsibilities"),                    // 岗位职责
    job_type: varchar("job_type", { length: 20 }).default("fulltime"), // 全职/实习
    education: varchar("education", { length: 50 }),             // 学历要求
    experience: varchar("experience", { length: 50 }),            // 经验要求
    official_url: varchar("official_url", { length: 500 }),      // 官网链接
    publish_date: timestamp("publish_date", { withTimezone: true }), // 发布时间
    deadline: timestamp("deadline", { withTimezone: true }),     // 截止时间
    status: varchar("status", { length: 20 }).default("active"),  // 状态：active/closed
    views: integer("views").notNull().default(0),                // 浏览量
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("jobs_company_idx").on(table.company),
    index("jobs_category_idx").on(table.category),
    index("jobs_job_type_idx").on(table.job_type),
    index("jobs_status_idx").on(table.status),
    index("jobs_publish_date_idx").on(table.publish_date),
  ]
);

// ==================== 健康检查表（系统表，不可删除）====================
export const healthCheck = pgTable("health_check", {
  id: integer("id").primaryKey(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

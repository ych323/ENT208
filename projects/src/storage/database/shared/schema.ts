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

// ==================== 健康检查表（系统表，不可删除）====================
export const healthCheck = pgTable("health_check", {
  id: integer("id").primaryKey(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

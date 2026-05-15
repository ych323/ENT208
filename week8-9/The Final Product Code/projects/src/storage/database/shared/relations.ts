import { relations } from "drizzle-orm/relations";
import { forumPosts, forumComments, learningResources, jobs } from "./schema";

export const forumPostsRelations = relations(forumPosts, ({ one, many }) => ({
  comments: many(forumComments),
}));

export const forumCommentsRelations = relations(forumComments, ({ one }) => ({
  post: one(forumPosts, {
    fields: [forumComments.post_id],
    references: [forumPosts.id],
  }),
}));

export const learningResourcesRelations = relations(learningResources, ({  }) => ({
}));

export const jobsRelations = relations(jobs, ({  }) => ({
}));
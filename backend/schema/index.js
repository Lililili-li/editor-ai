const { mysqlTable, serial, text, timestamp, boolean, int, json } = require('drizzle-orm/mysql-core');

// 用户表
const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  avatar: text('avatar'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 文章表
const articles = mysqlTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  contentJson: json('content_json'), // 存储富文本编辑器的JSON格式内容
  authorId: int('author_id').references(() => users.id),
  isPublished: boolean('is_published').default(false),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 标签表
const tags = mysqlTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  color: text('color'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 文章标签关联表
const articleTags = mysqlTable('article_tags', {
  id: serial('id').primaryKey(),
  articleId: int('article_id').references(() => articles.id),
  tagId: int('tag_id').references(() => tags.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// 评论表
const comments = mysqlTable('comments', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  articleId: int('article_id').references(() => articles.id),
  authorId: int('author_id').references(() => users.id),
  parentId: int('parent_id').references(() => comments.id), // 支持嵌套评论
  isApproved: boolean('is_approved').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 文件上传表
const uploads = mysqlTable('uploads', {
  id: serial('id').primaryKey(),
  filename: text('filename').notNull(),
  originalName: text('original_name').notNull(),
  mimeType: text('mime_type').notNull(),
  size: int('size').notNull(),
  path: text('path').notNull(),
  uploadedBy: int('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = {
  users,
  articles,
  tags,
  articleTags,
  comments,
  uploads,
};

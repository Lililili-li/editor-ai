const { mysqlTable, serial, text, timestamp, boolean, int, json, varchar, tinyint } = require('drizzle-orm/mysql-core');

// 用户表
const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  username: varchar({length: 20}).notNull().unique(),
  avatar: text('avatar').default(null),
  isActive: boolean('is_active').default(true),
  salt: varchar({length: 255}).notNull(),
  hash: varchar({length: 255}).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 文章表
const articles = mysqlTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  contentJson: json('content_json'), // 存储富文本编辑器的JSON格式内容
  likeCount: int('like_count'),
  viewCount: int('view_count'),
  collectionCount: int('collection_count'),
  authorId: int('author_id'),
  isPublished: boolean('is_published').default(false),
  publishedAt: timestamp('published_at'),
  icon: text('icon'),
  deleted: tinyint('deleted').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

const usersArticlesRoles = mysqlTable('users_articles_roles', {
  id: serial('id').primaryKey(),
  userId: int('user_id'),
  articleId: int('article_id'),
})
const usersArticlesLikes = mysqlTable('users_articles_likes', {
  id: serial('id').primaryKey(),
  userId: int('user_id'),
  articleId: int('article_id'),
})
const usersArticlesViews = mysqlTable('users_articles_views', {
  id: serial('id').primaryKey(),
  userId: int('user_id'),
  articleId: int('article_id'),
})
const usersArticlesCollections = mysqlTable('users_articles_collections', {
  id: serial('id').primaryKey(),
  userId: int('user_id'),
  articleId: int('article_id'),
})

module.exports = {
  users,
  articles,
  usersArticlesRoles,
  usersArticlesLikes,
  usersArticlesViews,
  usersArticlesCollections
};

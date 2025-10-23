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
  userId: int('user_id'),
  parentId: int('parent_id').default(null),
  title: text('title').notNull(),
  icon: text('icon'),
  content: text('content'),
  contentJson: json('content_json'), // 存储富文本编辑器的JSON格式内容
  likeCount: int('like_count').default(0),
  viewCount: int('view_count').default(0),
  collectionCount: int('collection_count').default(0),
  isPublish: boolean('is_publish').default(false),
  publishedAt: timestamp('published_at').default(null),
  deleted: tinyint('deleted').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

const usersArticlesRoles = mysqlTable('users_articles_roles', {
  id: serial('id').primaryKey(),
  userId: int('user_id').notNull(),
  articleId: int('article_id'),
})
const usersArticlesLikes = mysqlTable('users_articles_likes', {
  id: serial('id').primaryKey(),
  userId: int('user_id').notNull(),
  articleId: int('article_id'),
})
const usersArticlesViews = mysqlTable('users_articles_views', {
  id: serial('id').primaryKey(),
  userId: int('user_id').notNull(),
  articleId: int('article_id'),
})
const usersArticlesCollections = mysqlTable('users_articles_collections', {
  id: serial('id').primaryKey(),
  userId: int('user_id').notNull(),
  articleId: int('article_id'),
})


const templatesCategory = mysqlTable('templates_category', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

const templates = mysqlTable('templates', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(), // 内容标题
  content: text('content'), // 内容html
  contentJson: json('content_json'), //内容json
  icon: text('icon'), //标题的icon
  userId: int('user_id').notNull(), //模板发布人的id
  useCount: int('user_count').default(0), // 使用次数
  categoryId: int('category_id').notNull(), // 使用次数
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

module.exports = {
  users,
  articles,
  usersArticlesRoles,
  usersArticlesLikes,
  usersArticlesViews,
  usersArticlesCollections,
  templates,
  templatesCategory
};

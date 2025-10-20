require('dotenv').config();
const { db } = require('../utils/db');
const { users, articles, tags, articleTags, comments, uploads } = require('../schema');
const { eq, and, desc } = require('drizzle-orm');

// 示例：创建用户
async function createUser(userData) {
  try {
    const newUser = await db.insert(users).values({
      username: userData.username,
      email: userData.email,
      password: userData.password, // 注意：实际使用时需要加密
    }).returning();
    
    console.log('✅ 用户创建成功:', newUser[0]);
    return newUser[0];
  } catch (error) {
    console.error('❌ 创建用户失败:', error.message);
    throw error;
  }
}

// 示例：查询所有用户
async function getAllUsers() {
  try {
    const allUsers = await db.select().from(users);
    console.log('📋 所有用户:', allUsers);
    return allUsers;
  } catch (error) {
    console.error('❌ 查询用户失败:', error.message);
    throw error;
  }
}

// 示例：创建文章
async function createArticle(articleData) {
  try {
    const newArticle = await db.insert(articles).values({
      title: articleData.title,
      content: articleData.content,
      contentJson: articleData.contentJson,
      authorId: articleData.authorId,
      isPublished: articleData.isPublished || false,
    }).returning();
    
    console.log('✅ 文章创建成功:', newArticle[0]);
    return newArticle[0];
  } catch (error) {
    console.error('❌ 创建文章失败:', error.message);
    throw error;
  }
}

// 示例：查询用户及其文章
async function getUserWithArticles(userId) {
  try {
    const userWithArticles = await db
      .select({
        user: users,
        article: articles,
      })
      .from(users)
      .leftJoin(articles, eq(articles.authorId, users.id))
      .where(eq(users.id, userId));
    
    console.log('📋 用户及其文章:', userWithArticles);
    return userWithArticles;
  } catch (error) {
    console.error('❌ 查询用户文章失败:', error.message);
    throw error;
  }
}

// 示例：创建标签
async function createTag(tagData) {
  try {
    const newTag = await db.insert(tags).values({
      name: tagData.name,
      color: tagData.color,
    }).returning();
    
    console.log('✅ 标签创建成功:', newTag[0]);
    return newTag[0];
  } catch (error) {
    console.error('❌ 创建标签失败:', error.message);
    throw error;
  }
}

// 示例：为文章添加标签
async function addTagToArticle(articleId, tagId) {
  try {
    const newRelation = await db.insert(articleTags).values({
      articleId: articleId,
      tagId: tagId,
    }).returning();
    
    console.log('✅ 文章标签关联成功:', newRelation[0]);
    return newRelation[0];
  } catch (error) {
    console.error('❌ 添加文章标签失败:', error.message);
    throw error;
  }
}

// 示例：查询带标签的文章
async function getArticlesWithTags() {
  try {
    const articlesWithTags = await db
      .select({
        article: articles,
        tag: tags,
      })
      .from(articles)
      .leftJoin(articleTags, eq(articleTags.articleId, articles.id))
      .leftJoin(tags, eq(tags.id, articleTags.tagId))
      .orderBy(desc(articles.createdAt));
    
    console.log('📋 文章及其标签:', articlesWithTags);
    return articlesWithTags;
  } catch (error) {
    console.error('❌ 查询文章标签失败:', error.message);
    throw error;
  }
}

// 示例：创建评论
async function createComment(commentData) {
  try {
    const newComment = await db.insert(comments).values({
      content: commentData.content,
      articleId: commentData.articleId,
      authorId: commentData.authorId,
      parentId: commentData.parentId, // 可选，用于嵌套评论
      isApproved: commentData.isApproved || false,
    }).returning();
    
    console.log('✅ 评论创建成功:', newComment[0]);
    return newComment[0];
  } catch (error) {
    console.error('❌ 创建评论失败:', error.message);
    throw error;
  }
}

// 示例：查询文章的所有评论
async function getArticleComments(articleId) {
  try {
    const articleComments = await db
      .select({
        comment: comments,
        author: users,
      })
      .from(comments)
      .leftJoin(users, eq(users.id, comments.authorId))
      .where(and(
        eq(comments.articleId, articleId),
        eq(comments.isApproved, true)
      ))
      .orderBy(desc(comments.createdAt));
    
    console.log('📋 文章评论:', articleComments);
    return articleComments;
  } catch (error) {
    console.error('❌ 查询文章评论失败:', error.message);
    throw error;
  }
}

// 示例：文件上传记录
async function createUploadRecord(uploadData) {
  try {
    const newUpload = await db.insert(uploads).values({
      filename: uploadData.filename,
      originalName: uploadData.originalName,
      mimeType: uploadData.mimeType,
      size: uploadData.size,
      path: uploadData.path,
      uploadedBy: uploadData.uploadedBy,
    }).returning();
    
    console.log('✅ 上传记录创建成功:', newUpload[0]);
    return newUpload[0];
  } catch (error) {
    console.error('❌ 创建上传记录失败:', error.message);
    throw error;
  }
}

// 导出所有函数
module.exports = {
  createUser,
  getAllUsers,
  createArticle,
  getUserWithArticles,
  createTag,
  addTagToArticle,
  getArticlesWithTags,
  createComment,
  getArticleComments,
  createUploadRecord,
};

// 如果直接运行此文件，执行示例
if (require.main === module) {
  async function runExamples() {
    try {
      console.log('🚀 开始运行数据库操作示例...\n');
      
      // 示例数据
      const userData = {
        username: 'test_user',
        email: 'test@example.com',
        password: 'hashed_password_here',
      };
      
      const articleData = {
        title: '测试文章',
        content: '这是一篇测试文章的内容',
        contentJson: { type: 'doc', content: [] },
        authorId: 1,
        isPublished: true,
      };
      
      const tagData = {
        name: '技术',
        color: '#007bff',
      };
      
      // 注意：这些操作需要数据库连接正常
      console.log('⚠️  注意：这些示例需要数据库连接正常才能执行');
      console.log('📝 请确保：');
      console.log('  1. MySQL 服务正在运行');
      console.log('  2. 数据库 "editor_ai" 已创建');
      console.log('  3. 环境变量配置正确');
      console.log('  4. 已运行 pnpm run db:push 创建表结构\n');
      
    } catch (error) {
      console.error('❌ 示例运行失败:', error.message);
    }
  }
  
  runExamples();
}

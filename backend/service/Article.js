const { db } = require('../utils/db');
const { articles } = require('../schema');
const { eq, and, desc, like, sql } = require('drizzle-orm');
const { flatToTree } = require('../utils');

const getArticles = async (userInfo, type) => {
  let results = []
  try {
    if (!type) {
      results = await db.query.articles.findMany({
        where: eq(articles.userId, userInfo.id)
      })
      return flatToTree(results)
    }
  } catch (error) {
    throw new Error('服务器错误：' + error.message)
  }
}

const createArticle = async (userInfo, articleBody) => {
  const { title, content, contentJson, icon } = articleBody || {};
  const { id: userId } = userInfo
  try {
    const insertRes = await db.insert(articles).values({
      title,
      icon,
      content,
      contentJson,
      userId
    }).$returningId();
    const insertId = insertRes[0]?.id;
    if (!insertId) return null;
    const article = await db.query.articles.findFirst({ where: eq(articles.id, insertId) });
    return article
  } catch (error) {
    throw new Error('新增失败:' + error);
  }
}

const updateArticle = async (articleBody, id) => {
  const { title, content, contentJson, icon } = articleBody || {};
  try {
    await db.update(articles).set({
      title,
      content,
      contentJson,
      icon
    }).where(eq(articles.id, Number(id)));
  } catch (error) {
    throw new Error('更新失败:' + error);
  }
}

module.exports = {
  getArticles,
  createArticle,
  updateArticle
}
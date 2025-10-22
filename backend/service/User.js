const { db } = require('../utils/db');
const { users } = require('../schema');
const { eq, and, desc, like, sql } = require('drizzle-orm');
const { result } = require('../utils/results');
const { hashPassword, verifyPassword } = require('../utils');
const { generateAccessToken } = require('../utils/jwt');


// 登录（示例：仅按用户名查找，真实环境请校验密码并加盐哈希）
const login = async (data) => {
  const { username, password } = data || {};
  if (!username || !password) {
    throw new Error('username 和 password 为必填');
  }
  try {
    const item = await db.query.users.findFirst({
      where: eq(users.username, username),
    });
    if (!item) {
      throw new Error('用户名不正确');
    }
    const isMatch = verifyPassword(password, item.salt, item.hash)
    if (isMatch) {
      const payload = { id: item.id, username: item.username };
      const accessToken = generateAccessToken(payload);
      delete item.salt
      delete item.hash
      return result('登陆成功', 200, {...item, token: accessToken})
    }
    throw new Error('用户名/密码不正确');
  } catch (error) {
    throw new Error(error.message);
  }

}

// 创建用户
const createUser = async (data) => {
  const { username, password } = data || {};
  if (!username || !password) {
    throw new Error('username 和 password 为必填');
  }
  try {
    const item = await db.query.users.findFirst({
      where: eq(users.username, username),
    });
    if (item) throw new Error('用户名已注册:' + error)
  } catch (error) {
    throw new Error('注册失败:' + error);
  }
  try {
    const { salt, hash } = hashPassword(password);
    const res = await db.insert(users).values({
      username,
      hash,
      salt
    }).$returningId();
    const insertId = res[0]?.id;
    if (!insertId) return null;
    const created = await db.query.users.findFirst({ where: eq(users.id, insertId) });
    return result('注册成功', 200, created);
  } catch (error) {
    throw new Error('注册失败:' + error);
  }
}

// 根据ID获取用户
const getUserById = async (id) => {
  if (!id) return null
  try {
    const item = await db.query.users.findFirst({ where: eq(users.id, Number(id)) });
    return item;
  } catch (error) {
    throw new Error('获取用户信息失败:' + error);
  }
}

// 列表查询（分页、关键字、状态）
const listUsers = async (query = {}) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(query.pageSize) || 10, 1), 100);
  const keyword = query.keyword ? String(query.keyword).trim() : '';
  const activeStr = query.isActive;
  const isActiveFilter = activeStr === undefined ? undefined : activeStr === 'true' || activeStr === true;

  const whereConds = [];
  if (keyword) {
    whereConds.push(like(users.username, `%${keyword}%`));
  }
  if (typeof isActiveFilter === 'boolean') {
    whereConds.push(eq(users.isActive, isActiveFilter));
  }
  const whereExpr = whereConds.length > 0 ? and(...whereConds) : undefined;

  const offset = (page - 1) * pageSize;

  const rows = await db.select().from(users)
    .where(whereExpr)
    .orderBy(desc(users.createdAt))
    .limit(pageSize)
    .offset(offset);

  // 统计总数
  const totalRes = await db.select({ count: sql`COUNT(*)`.mapWith(Number) }).from(users).where(whereExpr);
  const total = Array.isArray(totalRes) && totalRes[0]?.count ? Number(totalRes[0].count) : 0;

  return {
    list: rows,
    page,
    pageSize,
    total,
  };
}

// 更新用户
const updateUser = async (id, data) => {
  if (!id) throw new Error('缺少 id');
  const payload = {};
  if (data.username !== undefined) payload.username = data.username;
  if (data.password !== undefined) payload.password = data.password;
  if (data.avatar !== undefined) payload.avatar = data.avatar;
  if (data.isActive !== undefined) payload.isActive = data.isActive;
  if (Object.keys(payload).length === 0) return await getUserById(id);

  await db.update(users).set(payload).where(eq(users.id, Number(id)));
  return await getUserById(id);
}

// 删除用户（硬删除）
const deleteUser = async (id) => {
  if (!id) throw new Error('缺少 id');
  const res = await db.delete(users).where(eq(users.id, Number(id)));
  return { affectedRows: res?.affectedRows ?? 0 };
}

module.exports = {
  login,
  createUser,
  getUserById,
  listUsers,
  updateUser,
  deleteUser,
}
const { verifyToken } = require('../utils/jwt');

/**
 * JWT 认证中间件
 * 从请求头 Authorization 中获取 token 并验证
 * 验证通过后将用户信息挂载到 req.user
 */
function authenticateToken(req, res, next) {
  // 从请求头获取 token（格式：Bearer <token>）
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // 提取 Bearer 后的 token

  if (!token) {
    return res.status(401).json({ message: '拒绝访问服务器' });
  }

  try {
    // 验证 token 并解析 payload
    const user = verifyToken(token);
    req.user = user; // 将用户信息挂载到请求对象，供后续接口使用
    next(); // 验证通过，继续处理请求
  } catch (error) {
    return res.status(403).json({ message: error.message }); // token 无效或过期
  }
}

module.exports = { authenticateToken };
const jwt = require('jsonwebtoken');

// 配置（建议放在环境变量中，如 .env 文件）
const JWT_SECRET = 'P2av34bNglMt6SHh'; // 密钥（生产环境需复杂且保密）
const ACCESS_TOKEN_EXPIRES_IN = '30d'; // 访问令牌有效期（15分钟）
const REFRESH_TOKEN_EXPIRES_IN = '60d'; // 刷新令牌有效期（7天）

/**
 * 生成访问令牌（Access Token）
 * @param {object} payload - 存储在 token 中的数据（如用户ID、角色）
 * @returns {string} 访问令牌
 */
function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

/**
 * 生成刷新令牌（Refresh Token）
 * @param {object} payload - 建议仅包含用户ID（减少敏感信息）
 * @returns {string} 刷新令牌
 */
function generateRefreshToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}

/**
 * 验证令牌有效性
 * @param {string} token - 待验证的 token
 * @returns {object} 解析后的 payload（验证失败抛出错误）
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    // 错误类型：token 过期（TokenExpiredError）、无效 token（JsonWebTokenError）等
    throw new Error(`Token 验证失败：${error.message}`);
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
};
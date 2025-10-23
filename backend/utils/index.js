const crypto = require('crypto');

/**
 * 生成随机盐值（防止彩虹表攻击）
 * @param {number} length - 盐值长度（推荐16-32字节）
 * @returns {string} 随机盐值（十六进制）
 */
function generateSalt(length = 16) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * 对密码进行 SHA-256 哈希（加盐 + 多轮迭代）
 * @param {string} password - 明文密码
 * @param {string} [salt] - 盐值（不传则自动生成）
 * @param {number} iterations - 迭代次数（推荐10000+，增加破解成本）
 * @returns {object} { salt, hash } - 盐值和哈希结果
 */
function hashPassword(password, salt = generateSalt(), iterations = 10000) {
  let hash = password;
  // 多轮迭代：重复哈希，增加计算成本
  for (let i = 0; i < iterations; i++) {
    // 拼接盐值和当前哈希结果，再进行 SHA-256 哈希
    hash = crypto
      .createHash('sha256')
      .update(salt + hash) // 盐值在前，密码哈希在后
      .digest('hex'); // 输出十六进制字符串
  }
  return { salt, hash };
}

/**
 * 验证密码是否匹配（使用相同的盐值和迭代次数）
 * @param {string} password - 待验证的明文密码
 * @param {string} salt - 存储的盐值
 * @param {string} storedHash - 存储的哈希结果
 * @param {number} iterations - 与加密时相同的迭代次数
 * @returns {boolean} 是否匹配
 */
function verifyPassword(password, salt, storedHash, iterations = 10000) {
  // 用相同的盐值和迭代次数计算哈希
  const { hash } = hashPassword(password, salt, iterations);
  // 对比计算结果与存储的哈希值
  return hash === storedHash;
}

/**
 * 扁平数据转树结构
 * @param {Array} flatData - 扁平数据数组
 * @param {Object} [options] - 配置项
 * @param {string} [options.idKey='id'] - 节点唯一标识字段名
 * @param {string} [options.parentIdKey='parentId'] - 父节点标识字段名
 * @param {string} [options.childrenKey='children'] - 子节点数组字段名
 * @param {string|number} [options.rootParentValue=null] - 根节点的 parentId 值（默认 null）
 * @returns {Array} 转换后的树结构数组
 */
function flatToTree(flatData, options = {}) {
  // 默认配置
  const {
    idKey = 'id',
    parentIdKey = 'parentId',
    childrenKey = 'children',
    rootParentValue = null
  } = options;

  // 校验输入数据
  if (!Array.isArray(flatData)) {
    throw new Error('输入必须是数组');
  }

  // 1. 构建节点映射表（id -> 节点），方便快速查找父节点
  const nodeMap = new Map();
  flatData.forEach(node => {
    // 给每个节点初始化子节点数组（避免后续判断 undefined）
    node[childrenKey] = node[childrenKey] || [];
    nodeMap.set(node[idKey], node);
  });

  // 2. 遍历所有节点，将子节点挂载到对应的父节点下
  const tree = [];
  flatData.forEach(node => {
    const parentId = node[parentIdKey];
    // 查找父节点
    const parentNode = nodeMap.get(parentId);

    if (parentNode) {
      // 有父节点：挂载到父节点的子节点数组中
      parentNode[childrenKey].push(node);
    } else {
      // 无父节点（或父节点为根节点值）：作为根节点加入树
      if (parentId === rootParentValue) {
        tree.push(node);
      }
    }
  });

  return tree;
}

module.exports = {
  hashPassword,
  verifyPassword,
  flatToTree
}



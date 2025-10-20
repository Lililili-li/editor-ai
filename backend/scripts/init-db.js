require('dotenv').config();
const { db, pool, testConnection } = require('../utils/db');
const { users, articles, tags, articleTags, comments, uploads } = require('../schema');

async function initDatabase() {
  try {
    console.log('🔄 初始化数据库...');
    
    // 测试连接
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('数据库连接失败');
    }

    console.log('✅ 数据库连接成功');
    console.log('📋 数据库表结构已定义:');
    console.log('  - users (用户表)');
    console.log('  - articles (文章表)');
    console.log('  - tags (标签表)');
    console.log('  - article_tags (文章标签关联表)');
    console.log('  - comments (评论表)');
    console.log('  - uploads (文件上传表)');
    
    console.log('\n📝 使用以下命令来管理数据库:');
    console.log('  pnpm run db:generate  - 生成迁移文件');
    console.log('  pnpm run db:push      - 推送schema到数据库');
    console.log('  pnpm run db:studio    - 打开Drizzle Studio');
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
  } finally {
    await pool.end();
  }
}

initDatabase();

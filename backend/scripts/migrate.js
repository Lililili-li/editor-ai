require('dotenv').config();
const { migrate } = require('drizzle-orm/mysql2/migrator');
const { db, pool } = require('../utils/db');

async function runMigrations() {
  try {
    console.log('🔄 开始运行数据库迁移...');
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('✅ 数据库迁移完成');
  } catch (error) {
    console.error('❌ 数据库迁移失败:', error);
  } finally {
    await pool.end();
  }
}

runMigrations();

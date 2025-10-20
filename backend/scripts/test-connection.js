require('dotenv').config();
const { testConnection, closeConnection } = require('../utils/db');

async function testDatabaseConnection() {
  console.log('🔄 测试数据库连接...');
  console.log('📋 当前配置:');
  console.log(`  Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`  Port: ${process.env.DB_PORT || 3306}`);
  console.log(`  Database: ${process.env.DB_NAME || 'editor_ai'}`);
  console.log(`  User: ${process.env.DB_USER || 'root'}`);
  console.log('');
  
  const isConnected = await testConnection();
  
  if (isConnected) {
    console.log('🎉 数据库连接测试成功！');
    console.log('');
    console.log('📝 下一步操作:');
    console.log('  1. 运行 pnpm run db:push 创建表结构');
    console.log('  2. 运行 pnpm run db:studio 打开数据库管理界面');
    console.log('  3. 查看 examples/db-usage.js 了解如何使用数据库');
  } else {
    console.log('❌ 数据库连接测试失败！');
    console.log('');
    console.log('🔧 请检查:');
    console.log('  1. MySQL 服务是否正在运行');
    console.log('  2. 数据库 "editor_ai" 是否已创建');
    console.log('  3. 用户名和密码是否正确');
    console.log('  4. 网络连接是否正常');
    console.log('  5. 防火墙设置是否允许连接');
  }
  
  await closeConnection();
}

testDatabaseConnection();

require('dotenv').config();

module.exports = {
  schema: './schema/index.js',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'editor_ai',
  },
  verbose: true,
  strict: true,
};

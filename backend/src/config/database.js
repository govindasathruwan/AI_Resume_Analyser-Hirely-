const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const createSqliteInstance = () => {
  const dbPath = process.env.SQLITE_STORAGE_PATH || path.join(__dirname, '..', '..', 'data', 'database.sqlite');
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  console.log(`📁 Using SQLite database at: ${dbPath}`);
  return new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
    },
  });
};

const createMysqlInstance = () => {
  const dbName = process.env.DB_NAME || 'ai_resume_analyser';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || 3306;

  console.log(`🐬 Attempting MySQL connection to ${dbUser}@${dbHost}:${dbPort}/${dbName}`);
  return new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
    },
  });
};

let sequelize = process.env.DB_DIALECT === 'mysql' ? createMysqlInstance() : createSqliteInstance();

/**
 * Initialize Database Connection with auto-creation & auto-fallback
 */
const initDatabase = async () => {
  try {
    if (sequelize.getDialect() === 'mysql') {
      const mysql = require('mysql2/promise');
      const dbName = process.env.DB_NAME || 'ai_resume_analyser';
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
      });
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
      await connection.end();
    }

    await sequelize.authenticate();
    console.log(`✅ Database connection established using [${sequelize.getDialect().toUpperCase()}]`);

    const isSqlite = sequelize.getDialect() === 'sqlite';
    await sequelize.sync(isSqlite ? {} : { alter: true });
    console.log('✅ Database tables synchronized.');
  } catch (error) {
    console.warn(`⚠️ Primary DB connection failed (${sequelize.getDialect().toUpperCase()}): ${error.message}`);

    if (sequelize.getDialect() === 'mysql') {
      console.log('🔄 Switching fallback to SQLite local database...');
      sequelize = createSqliteInstance();
      await sequelize.authenticate();
      await sequelize.sync({});
      console.log('✅ SQLite fallback database initialized successfully.');
    } else {
      throw error;
    }
  }

  return sequelize;
};

module.exports = sequelize;
module.exports.initDatabase = initDatabase;

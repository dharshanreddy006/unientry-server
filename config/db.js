const { Sequelize } = require('sequelize');

// Support Railway's MYSQL_URL / DATABASE_URL connection string,
// or fall back to individual env vars for local XAMPP development.
const connectionUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;

let sequelize;

if (connectionUrl) {
  // Railway / cloud deployment: use the connection string directly
  sequelize = new Sequelize(connectionUrl, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  // Local development: use individual env vars (XAMPP)
  sequelize = new Sequelize(
    process.env.DB_NAME || 'unientry',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      dialectOptions: process.env.DB_SOCKET ? {
        socketPath: process.env.DB_SOCKET,
      } : {},
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

let dbStatus = {
  connected: false,
  error: null
};

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Connected Successfully');

    // Sync all models (creates tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('✅ Database tables synced');
    dbStatus.connected = true;
    dbStatus.error = null;
  } catch (error) {
    console.error('❌ MySQL Connection Error:', error.message);
    dbStatus.connected = false;
    dbStatus.error = error.message;
    // Do not call process.exit(1) so the server can boot and serve diagnostic info
  }
};

const getDbStatus = () => dbStatus;

module.exports = { sequelize, connectDB, getDbStatus };

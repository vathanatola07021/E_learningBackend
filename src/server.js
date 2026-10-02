const app = require('./app');
const env = require('./config/env');
const db = require('./config/database');

async function startServer() {
  console.log('\n======================================================');
  console.log('       EduLearn Express.js + MySQL Backend API        ');
  console.log('======================================================');

  // Test MySQL connection
  await db.testConnection();

  const server = app.listen(env.port, () => {
    console.log(`\n🚀 Server is running on: http://localhost:${env.port}`);
    console.log(`📡 Health Check URL:     http://localhost:${env.port}/api/v1/health`);
    console.log(`📚 Base API URL:         http://localhost:${env.port}/api/v1`);
    console.log(`💾 MySQL Database:       ${env.db.database} on ${env.db.host}:${env.db.port}`);
    console.log(`⚙️  Environment:          ${env.nodeEnv}`);
    console.log('\n📱 Flutter Connection Tip:');
    console.log('   In "E-learning/lib/app/config/app_config.dart", set:');
    console.log('   static bool useFakeApi = false;');
    console.log('   to connect your Flutter app directly to this backend!');
    console.log('======================================================\n');
  });

  // Graceful shutdown handling
  const handleShutdown = async (signal) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      console.log('HTTP server closed.');
      if (db.pool) {
        try {
          await db.pool.end();
          console.log('MySQL connection pool closed.');
        } catch (e) {
          console.error('Error closing pool:', e.message);
        }
      }
      process.exit(0);
    });
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const env = require('../config/env');

async function initDb() {
  console.log('========================================================');
  console.log(' EduLearn - MySQL Database Initialization & Migration   ');
  console.log('========================================================');
  console.log(`Target: ${env.db.host}:${env.db.port} | User: ${env.db.user} | DB: ${env.db.database}`);

  let serverConn = null;
  try {
    // 1. Connect without selecting database to create DB if needed
    console.log('\n[1/4] Connecting to MySQL server...');
    serverConn = await mysql.createConnection({
      host: env.db.host,
      port: env.db.port,
      user: env.db.user,
      password: env.db.password,
      multipleStatements: true,
    });

    console.log(`[2/4] Ensuring database "${env.db.database}" exists...`);
    await serverConn.query(
      `CREATE DATABASE IF NOT EXISTS \`${env.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    console.log(`Database "${env.db.database}" is ready.`);
    await serverConn.end();

    // 2. Connect to the specific database
    console.log(`\n[3/4] Executing schema.sql on "${env.db.database}"...`);
    const dbConn = await mysql.createConnection({
      host: env.db.host,
      port: env.db.port,
      user: env.db.user,
      password: env.db.password,
      database: env.db.database,
      multipleStatements: true,
    });

    const schemaPath = path.resolve(__dirname, '../../schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await dbConn.query(schemaSql);
    console.log('Schema tables created successfully (19 tables).');

    // 3. Seed data
    console.log('\n[4/4] Executing seed.sql to populate initial dataset...');
    const seedPath = path.resolve(__dirname, '../../seed.sql');
    if (fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await dbConn.query(seedSql);
      console.log('Seed data inserted successfully.');
    } else {
      console.warn('seed.sql not found. Generating seeds...');
      require('./generateSeeds');
    }

    // Verify record counts
    const [userRows] = await dbConn.query('SELECT COUNT(*) as count FROM users');
    const [courseRows] = await dbConn.query('SELECT COUNT(*) as count FROM courses');
    const [lessonRows] = await dbConn.query('SELECT COUNT(*) as count FROM lessons');
    const [quizRows] = await dbConn.query('SELECT COUNT(*) as count FROM quizzes');
    const [asgRows] = await dbConn.query('SELECT COUNT(*) as count FROM assignments');

    console.log('\n---------------- Verification Summary ------------------');
    console.log(`Users:       ${userRows[0].count}`);
    console.log(`Courses:     ${courseRows[0].count}`);
    console.log(`Lessons:     ${lessonRows[0].count}`);
    console.log(`Quizzes:     ${quizRows[0].count}`);
    console.log(`Assignments: ${asgRows[0].count}`);
    console.log('--------------------------------------------------------');
    console.log(' MySQL Database initialization completed successfully! 🎉');
    console.log('========================================================\n');

    await dbConn.end();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Database Initialization Error:');
    console.error(err.message);
    if (err.code === 'ECONNREFUSED') {
      console.error('\n[Tip] MySQL server is not running or not listening on ' + env.db.host + ':' + env.db.port);
      console.error('Please make sure MySQL is started (e.g., via XAMPP Control Panel, Laragon, or Docker).');
    }
    process.exit(1);
  }
}

initDb();

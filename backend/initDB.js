import pool from './db.js';

const setupDatabase = async () => {
    try {
        console.log('⏳ Creating global_upload_logs table in Neon...');
        await pool.query(`
      CREATE TABLE IF NOT EXISTS global_upload_logs (
        id SERIAL PRIMARY KEY,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        console.log('🚀 SUCCESS: global_upload_logs table is ready!');
        process.exit(0);
    } catch (error) {
        console.error('❌ ERROR creating table:', error);
        process.exit(1);
    }
};

setupDatabase();
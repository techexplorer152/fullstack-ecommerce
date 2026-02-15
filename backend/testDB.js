import pool from './db.js';

async function test() {
    try {
        const res = await pool.query("SELECT NOW()");
        console.log("✅ Connected to Neon! Current time:", res.rows[0]);
        process.exit(0);
    } catch (err) {
        console.error("❌ Connection failed:", err);
        process.exit(1);
    }
}

test();

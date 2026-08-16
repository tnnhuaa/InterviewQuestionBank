require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function runSQLFile(filePath) {
    try {
        const sql = fs.readFileSync(filePath, 'utf8');
        console.log(`Executing ${filePath}...`);
        await pool.query(sql);
        console.log(`Successfully executed ${filePath}`);
    } catch (err) {
        console.error(`Error executing ${filePath}:`, err);
        throw err;
    }
}

async function setupDb() {
    try {
        await runSQLFile(path.join(__dirname, 'schema.sql'));
        await runSQLFile(path.join(__dirname, 'seed_data.sql'));
        console.log('Database setup completed successfully.');
    } catch (err) {
        console.error('Database setup failed.');
    } finally {
        pool.end();
    }
}

setupDb();

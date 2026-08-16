import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

// Load .env variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client } = pg;

async function runFile(client, filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  await client.query(sql);
}

async function main() {
  const command = process.argv[2];
  
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is not set in .env');
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    await client.connect();
    
    if (command === 'push') {
      console.log('Running schema...');
      await runFile(client, path.join(__dirname, '../../DB/01_schema.sql'));
      console.log('Schema pushed successfully.');
    } else if (command === 'seed') {
      console.log('Running seed...');
      await runFile(client, path.join(__dirname, '../../DB/02_seed.sql'));
      console.log('Seed applied successfully.');
    } else if (command === 'reset') {
      console.log('Dropping public schema...');
      // Neon requires special care if we are dropping schema, but dropping schema cascade is standard
      await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO public;');
      console.log('Schema dropped. Running push and seed...');
      await runFile(client, path.join(__dirname, '../../DB/01_schema.sql'));
      await runFile(client, path.join(__dirname, '../../DB/02_seed.sql'));
      console.log('Database reset successfully.');
    } else if (command === 'status') {
      const res = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      console.log('Tables in public schema:');
      if (res.rows.length === 0) {
        console.log('(No tables found)');
      } else {
        res.rows.forEach(r => console.log(`- ${r.table_name}`));
      }
    } else {
      console.log('Unknown command. Use: push, seed, reset, status');
    }
  } catch (err) {
    console.error('Error executing database script:');
    console.error(err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();

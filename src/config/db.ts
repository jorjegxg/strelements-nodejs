import { Pool } from "pg";
// const dbConfig = {
//   user: CONFIG.DB_USER,
//   password: CONFIG.DB_PASSWORD,
//   host: CONFIG.DB_HOST,
//   database: CONFIG.DATABASE,
//   port: Number(CONFIG.DB_PORT),
// };

// const connectionString = CONFIG.DATABASE_URL;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default pool;

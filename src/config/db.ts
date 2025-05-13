import { CONFIG } from "./config";
console.log("CONFIG------------------", CONFIG.toString());
const dbConfig = {
  user: CONFIG.DB_USER,
  password: CONFIG.DB_PASSWORD,
  host: CONFIG.DB_HOST,
  database: CONFIG.DATABASE,
  port: Number(CONFIG.DB_PORT),
};

export default dbConfig;

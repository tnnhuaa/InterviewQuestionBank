import pg from "pg";
import { getEnvironment } from "../../config/environment.js";

const environment = getEnvironment();

export const pool = new pg.Pool({
  connectionString: environment.databaseUrl,
  ssl: environment.databaseSsl ? { rejectUnauthorized: true } : false,
  max: environment.dbPoolMax,
});

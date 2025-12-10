import mysql from "mysql2/promise";

// Database configuration interface
interface DbConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
  connectionLimit?: number;
  waitForConnections?: boolean;
  queueLimit?: number;
  connectTimeout?: number;
}

// Connection pool instance
let pool: mysql.Pool | null = null;

/**
 * Get database configuration from environment variables
 */
function getDbConfig(): DbConfig {
  const config: DbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "industrial_catalogue",
    port: parseInt(process.env.DB_PORT || "3306"),
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || "10"),
    waitForConnections: true,
    queueLimit: 0,
    connectTimeout: 30000, // 30 seconds (reduced from 60)
  };

  console.log("DB Config:", {
    host: config.host,
    port: config.port,
    user: config.user,
    database: config.database,
    hasPassword: !!config.password,
  });

  return config;
}

/**
 * Initialize database connection pool
 */
export function initializePool(): mysql.Pool {
  if (!pool) {
    const config = getDbConfig();
    pool = mysql.createPool(config);

    // Test the connection
    pool
      .getConnection()
      .then((connection) => {
        console.log("✓ Database connected successfully");
        connection.release();
      })
      .catch((err) => {
        console.error("✗ Database connection failed:", err.message);
      });
  }

  return pool;
}

/**
 * Get database connection pool (creates if not exists)
 */
export function getPool(): mysql.Pool {
  if (!pool) {
    return initializePool();
  }
  return pool;
}

/**
 * Execute a query with automatic connection management
 */
export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const connection = await getPool().getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results as T;
  } finally {
    connection.release();
  }
}

/**
 * Execute a query and return first row
 */
export async function queryOne<T = any>(
  sql: string,
  params?: any[],
): Promise<T | null> {
  const results = await query<any[]>(sql, params);
  return results.length > 0 ? (results[0] as T) : null;
}

/**
 * Close database connection pool
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log("✓ Database connection pool closed");
  }
}

/**
 * Helper to build WHERE clause from filters
 */
export function buildWhereClause(
  filters: Record<string, any>,
  allowedFields: string[],
): { where: string; params: any[] } {
  const conditions: string[] = [];
  const params: any[] = [];

  for (const [key, value] of Object.entries(filters)) {
    if (allowedFields.includes(key) && value !== undefined && value !== null) {
      conditions.push(`${key} = ?`);
      params.push(value);
    }
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  return { where, params };
}

/**
 * Helper for pagination
 */
export function buildPagination(
  page: number = 1,
  limit: number = 20,
): {
  limit: number;
  offset: number;
  sql: string;
} {
  const validPage = Math.max(1, page);
  const validLimit = Math.min(Math.max(1, limit), 100); // Max 100 items per page
  const offset = (validPage - 1) * validLimit;

  return {
    limit: validLimit,
    offset,
    sql: `LIMIT ${validLimit} OFFSET ${offset}`,
  };
}

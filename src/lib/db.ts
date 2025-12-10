import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER ,
  password: process.env.POSTGRES_PASSWORD ,
  database: process.env.POSTGRES_DB ,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    // console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export const getClient = async () => {
  const client = await pool.connect();
  const originalQuery = client.query.bind(client);
  const release = client.release.bind(client);

  // Set a timeout of 5 seconds
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
  }, 5000);

  // Monkey patch the query method to track query durations
  // Use `any` casts to avoid TypeScript overload incompatibilities when monkey-patching
  (client as any).query = (...args: any[]) => {
    return (originalQuery as any).apply(undefined, args);
  };

  (client as any).release = () => {
    clearTimeout(timeout);
    // restore original methods
    (client as any).query = originalQuery;
    (client as any).release = release;
    return release();
  };

  return client;
};

export default pool;
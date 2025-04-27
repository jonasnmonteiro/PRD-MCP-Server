import { getPromisifiedDb } from './db.js';

/**
 * Increment a named metric counter (creates the metric if it doesn't exist)
 * @param name The metric name to increment
 * @param increment The amount to add (defaults to 1)
 */
export async function incrementMetric(name: string, increment = 1): Promise<void> {
  const db = getPromisifiedDb();
  await db.run(
    `INSERT INTO metrics (name, count)
     VALUES (?, ?)
     ON CONFLICT(name) DO UPDATE SET count = count + excluded.count`,
    [name, increment]
  );
}

/**
 * Retrieve all metrics and their counts
 */
export async function getMetrics(): Promise<Array<{ name: string; count: number }>> {
  const db = getPromisifiedDb();
  const rows = await db.all<{ name: string; count: number }>(
    `SELECT name, count FROM metrics ORDER BY name`
  );
  return rows;
} 
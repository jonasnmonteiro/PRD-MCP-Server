import { z } from 'zod';
import { logger } from '../config/logging.js';
import { getMetrics } from '../storage/metrics.js';

/**
 * Schema for the stats tool (no inputs)
 */
export const statsSchema = z.object({});

/**
 * Retrieve all metrics counters
 */
export async function stats(): Promise<Array<{ name: string; count: number }>> {
  try {
    const metrics = await getMetrics();
    return metrics;
  } catch (error) {
    logger.error(`Error retrieving metrics: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to retrieve metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 
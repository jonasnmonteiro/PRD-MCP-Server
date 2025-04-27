import { z } from 'zod';
import { logger } from '../config/logging.js';
import { getDatabase } from '../storage/db.js';
import { AiProviderManager } from '../core/ai-providers/index.js';
import { getProviderConfigs } from '../config/ai-providers.js';

/**
 * Schema for the health_check tool
 */
export const healthCheckSchema = z.object({});

/**
 * Perform a system health check: database connectivity and AI provider availability
 */
export async function healthCheck(): Promise<{ db: boolean; providers: Array<{ id: string; name: string; available: boolean }>; error?: string }> {
  const result: { db: boolean; providers: Array<{ id: string; name: string; available: boolean }>; error?: string } = { db: false, providers: [] };
  try {
    // Database connectivity
    getDatabase();
    result.db = true;

    // AI providers
    const configs = await getProviderConfigs();
    const manager = new AiProviderManager(configs);
    result.providers = await manager.listAvailableProviders();

    return result;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error(`Health check error: ${msg}`);
    result.error = msg;
    return result;
  }
} 
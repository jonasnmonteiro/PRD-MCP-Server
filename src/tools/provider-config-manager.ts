import { z } from 'zod';
import { logger } from '../config/logging.js';
import {
  getStoredProviderConfig,
  updateStoredProviderConfig,
} from '../storage/provider-config.js';

/**
 * Schema for getting all provider configurations (no inputs)
 */
export const getProviderConfigSchema = z.object({});
export async function getProviderConfig() {
  try {
    const configs = await getStoredProviderConfig();
    return configs;
  } catch (error) {
    logger.error(`Error retrieving provider configurations: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to retrieve provider configurations: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Schema for updating provider configuration
 */
export const updateProviderConfigSchema = z.object({
  providerId: z.string().min(1, 'Provider ID is required'),
  apiKey: z.string().optional(),
  baseUrl: z.string().optional(),
  model: z.string().optional(),
});
export async function updateProviderConfig(
  providerId: string,
  apiKey?: string,
  baseUrl?: string,
  model?: string
) {
  try {
    const partial = { apiKey, baseUrl, model };
    await updateStoredProviderConfig(providerId, partial);
    return { success: true };
  } catch (error) {
    logger.error(`Error updating provider configuration: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to update provider configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 
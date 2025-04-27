import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { AiProviderConfig } from '../core/ai-providers/provider.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, '../../data/provider-config.json');

/**
 * Ensure the provider-config JSON file exists.
 */
async function ensureConfigFile(): Promise<void> {
  try {
    await fs.access(configPath);
  } catch {
    // File doesn't exist, initialize with empty object
    await fs.mkdir(path.dirname(configPath), { recursive: true });
    await fs.writeFile(configPath, JSON.stringify({}), 'utf-8');
  }
}

/**
 * Read stored provider configuration overrides from disk.
 */
export async function getStoredProviderConfig(): Promise<Record<string, Partial<AiProviderConfig>>> {
  await ensureConfigFile();
  const data = await fs.readFile(configPath, 'utf-8');
  try {
    const obj = JSON.parse(data);
    return obj;
  } catch {
    return {};
  }
}

/**
 * Update a specific provider's configuration override and persist it.
 * @param providerId The ID of the provider to update
 * @param configPartial Partial configuration to merge
 */
export async function updateStoredProviderConfig(
  providerId: string,
  configPartial: Partial<AiProviderConfig>
): Promise<void> {
  await ensureConfigFile();
  const raw = await fs.readFile(configPath, 'utf-8');
  let allConfigs: Record<string, Partial<AiProviderConfig>>;
  try {
    allConfigs = JSON.parse(raw);
  } catch {
    allConfigs = {};
  }
  const existing = allConfigs[providerId] || {};
  allConfigs[providerId] = { ...existing, ...configPartial };
  await fs.writeFile(configPath, JSON.stringify(allConfigs, null, 2), 'utf-8');
} 
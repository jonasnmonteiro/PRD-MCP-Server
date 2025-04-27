import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../config/logging.js';

// Schema for get_logs tool
export const getLogsSchema = z.object({
  fileName: z.string().optional(),
  lines: z.number().int().positive().optional(),
});

/**
 * Retrieve the last N lines from a log file in logs/ directory
 * @param fileName Name of the log file (e.g., 'combined.log')
 * @param lines Number of lines to return (default 100)
 */
export async function getLogs(
  fileName: string = 'combined.log',
  lines: number = 100
): Promise<string> {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const logPath = path.join(__dirname, '../../logs', fileName);
    const content = await fs.readFile(logPath, 'utf-8');
    const allLines = content.split(/\r?\n/);
    const tail = allLines.slice(-lines).join('\n');
    return tail;
  } catch (error) {
    logger.error(`Error reading logs: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to read logs: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 
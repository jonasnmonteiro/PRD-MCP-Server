import { z } from 'zod';
import { saveTemplate, Template } from '../storage/templates.js';
import { logger } from '../config/logging.js';

/**
 * Input schema for the Create Template tool
 */
export const createTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  content: z.string().min(1, "Template content is required"),
  tags: z.array(z.string()).optional(),
});

/**
 * Type for the input parameters
 */
export type CreateTemplateParams = z.infer<typeof createTemplateSchema>;

/**
 * Create a new PRD template in storage
 *
 * @param name - The name of the template
 * @param description - Optional description of the template
 * @param content - Markdown content of the template
 * @param tags - Optional array of tags
 * @returns The created Template object
 */
export async function createTemplate(
  name: string,
  description: string | undefined,
  content: string,
  tags?: string[]
): Promise<Template> {
  try {
    logger.info(`Creating new template: ${name}`);
    const template = await saveTemplate({ name, description, content, tags });
    logger.info(`Template created successfully: ${template.id}`);
    return template;
  } catch (error) {
    logger.error(`Error creating template: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to create template: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 
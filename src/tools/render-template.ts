import { z } from 'zod';
import { TemplateFallbackProvider } from '../core/ai-providers/template-fallback-provider.js';
import { logger } from '../config/logging.js';

/**
 * Schema for render_template tool
 */
export const renderTemplateSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  productDescription: z.string().min(1, 'Product description is required'),
  targetAudience: z.string().min(1, 'Target audience is required'),
  coreFeatures: z.array(z.string()).min(1, 'At least one core feature is required'),
  constraints: z.array(z.string()).optional(),
  templateName: z.string().optional(),
});

/**
 * Render a PRD template using placeholder substitution only (no AI)
 */
export async function renderTemplate(
  productName: string,
  productDescription: string,
  targetAudience: string,
  coreFeatures: string[],
  constraints?: string[],
  templateName: string = 'standard'
): Promise<string> {
  try {
    const provider = new TemplateFallbackProvider({ id: 'template' });
    const input = { productName, productDescription, targetAudience, coreFeatures, constraints, templateName };
    const content = await provider.generatePrd(input, {});
    return content;
  } catch (error) {
    logger.error(`Error rendering template: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to render template: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 
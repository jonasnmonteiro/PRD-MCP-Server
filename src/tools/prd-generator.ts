import { z } from 'zod';
import { logger } from '../config/logging.js';
import { incrementMetric } from '../storage/metrics.js';
import { AiProviderManager } from '../core/ai-providers/index.js';
import { AiProviderOptions, PrdGenerationInput } from '../core/ai-providers/provider.js';
import { getProviderConfigs, getDefaultProviderId } from '../config/ai-providers.js';

/**
 * Input schema for the PRD Generator tool
 */
export const generatePrdSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  productDescription: z.string().min(1, "Product description is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  coreFeatures: z.array(z.string()).min(1, "At least one core feature is required"),
  constraints: z.array(z.string()).optional(),
  templateName: z.string().optional(),
  // New parameters for AI-driven generation
  providerId: z.string().optional(),
  additionalContext: z.string().optional(),
  providerOptions: z.record(z.any()).optional(),
});

// Type for the input parameters
export type GeneratePrdParams = z.infer<typeof generatePrdSchema>;

// Create and cache the provider manager
/**
 * Always loads the latest provider configs from storage/env for hot-reload support.
 */
async function getProviderManager(): Promise<AiProviderManager> {
  const configs = await getProviderConfigs();
  return new AiProviderManager(configs);
}

/**
 * Generate a PRD from the given parameters using an AI provider or template fallback
 * 
 * @param productName - The name of the product
 * @param productDescription - Description of the product
 * @param targetAudience - Description of the target audience
 * @param coreFeatures - Array of core features
 * @param constraints - Optional array of constraints
 * @param templateName - Optional template name to use (defaults to 'standard')
 * @param providerId - Optional specific AI provider to use
 * @param additionalContext - Optional additional context for the AI
 * @param providerOptions - Optional provider-specific options
 * @returns The generated PRD as a markdown string
 */
export async function generatePRD(
  productName: string,
  productDescription: string,
  targetAudience: string,
  coreFeatures: string[],
  constraints?: string[],
  templateName: string = 'standard',
  providerId?: string,
  additionalContext?: string,
  providerOptions?: Record<string, any>
): Promise<string> {
  logger.info(`Generating PRD for "${productName}" using template: ${templateName}`);
  
  try {
    // Get the provider manager
    const manager = await getProviderManager();
    
    // Convert provider options to the expected format
    const options: AiProviderOptions = {
      ...(providerOptions || {}),
    };
    
    // Prepare input for the provider
    const input: PrdGenerationInput = {
      productName,
      productDescription,
      targetAudience,
      coreFeatures,
      constraints,
      templateName,
      additionalContext
    };
    
    // Check if a specific provider is requested, otherwise use the default or auto-select
    const preferredProviderId = providerId || getDefaultProviderId();
    
    // Select the provider (with fallback if needed)
    const provider = await manager.selectProvider(preferredProviderId);
    
    // Metrics: track AI calls or template fallbacks
    if (provider.id === 'template') {
      await incrementMetric('fallbacks');
    } else {
      await incrementMetric('ai_calls');
    }
    
    // Generate PRD using the selected provider
    const prdContent = await provider.generatePrd(input, options);
    
    // Metrics: count successful PRD generations
    await incrementMetric('prd_generated');
    
    logger.info(`PRD generated successfully for "${productName}" using ${provider.name}`);
    return prdContent;
  } catch (error) {
    logger.error(`Error generating PRD: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to generate PRD: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * List all available AI providers
 * @returns Array of provider information objects
 */
export async function listAiProviders(): Promise<Array<{ id: string, name: string, available: boolean }>> {
  try {
    const manager = await getProviderManager();
    return await manager.listAvailableProviders();
  } catch (error) {
    logger.error(`Error listing providers: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}
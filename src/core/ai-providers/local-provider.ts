import { AiProvider, AiProviderConfig, AiProviderOptions, PrdGenerationInput } from './provider.js';
import { logger } from '../../config/logging.js';

/**
 * Local model provider implementation (stub)
 * This implementation would support local LLMs via APIs like Ollama or LM Studio
 */
export class LocalModelProvider implements AiProvider {
  readonly id = 'local';
  readonly name = 'Local Model';
  
  private config: AiProviderConfig;
  
  constructor(config: AiProviderConfig) {
    this.config = config;
  }
  
  /**
   * Check if the provider is properly configured and available
   */
  async isAvailable(): Promise<boolean> {
    // In a real implementation, this would try to ping the local API endpoint
    return !!this.config.baseUrl;
  }
  
  /**
   * Generate a PRD using a local LLM API
   * Note: This is a stub implementation that would need to be updated
   * with the actual local model API client once available/needed
   */
  async generatePrd(input: PrdGenerationInput, options?: AiProviderOptions): Promise<string> {
    if (!this.config.baseUrl) {
      throw new Error('Local model API endpoint not configured. Check your configuration.');
    }
    
    try {
      logger.info(`Generating PRD with Local Model (${this.config.model || 'default'}) for product: ${input.productName}`);
      
      // This is where the actual implementation would go
      // For now, we'll just throw a not implemented error
      
      throw new Error('Local model PRD generation not yet implemented');
      
    } catch (error) {
      logger.error(`Error generating PRD with Local Model: ${error instanceof Error ? error.message : String(error)}`);
      throw new Error(`Failed to generate PRD with Local Model: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 
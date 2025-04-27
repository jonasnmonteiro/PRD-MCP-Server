import { AiProvider, AiProviderConfig } from './provider.js';
import { OpenAiProvider } from './openai-provider.js';
import { GeminiProvider } from './gemini-provider.js';
import { AnthropicProvider } from './anthropic-provider.js';
import { LocalModelProvider } from './local-provider.js';
import { TemplateFallbackProvider } from './template-fallback-provider.js';
import { logger } from '../../config/logging.js';

// Provider registry
const providers: Record<string, new (config: AiProviderConfig) => AiProvider> = {
  openai: OpenAiProvider,
  gemini: GeminiProvider,
  anthropic: AnthropicProvider,
  local: LocalModelProvider,
  template: TemplateFallbackProvider,
};

// Default fallback provider is template-based
const DEFAULT_PROVIDER = 'template';

/**
 * Provider manager for creating, caching, and selecting AI providers
 */
export class AiProviderManager {
  private providerInstances: Map<string, AiProvider> = new Map();
  private configs: Record<string, AiProviderConfig>;
  
  constructor(configs: Record<string, AiProviderConfig>) {
    this.configs = configs;
  }
  
  /**
   * Get an AI provider by ID, creating it if it doesn't exist
   */
  getProvider(providerId: string): AiProvider | null {
    // Check if provider exists in registry
    if (!providers[providerId]) {
      logger.warn(`Unknown provider: ${providerId}`);
      return null;
    }
    
    // Check if provider instance already exists
    if (this.providerInstances.has(providerId)) {
      return this.providerInstances.get(providerId) || null;
    }
    
    try {
      // Get config for this provider
      const config = this.configs[providerId] || { id: providerId };
      
      // Create a new provider instance
      const ProviderClass = providers[providerId];
      const provider = new ProviderClass(config);
      
      // Cache the provider instance
      this.providerInstances.set(providerId, provider);
      
      return provider;
    } catch (error) {
      logger.error(`Error creating provider ${providerId}: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }
  
  /**
   * List all available providers with their IDs and names
   */
  async listAvailableProviders(): Promise<Array<{ id: string, name: string, available: boolean }>> {
    const result = [];
    
    for (const providerId of Object.keys(providers)) {
      const provider = this.getProvider(providerId);
      
      if (provider) {
        let available = false;
        try {
          available = await provider.isAvailable();
        } catch (error) {
          logger.warn(`Error checking availability for provider ${providerId}: ${error instanceof Error ? error.message : String(error)}`);
        }
        
        result.push({
          id: provider.id,
          name: provider.name,
          available
        });
      }
    }
    
    return result;
  }
  
  /**
   * Select the best available provider, with fallback to template-based
   */
  async selectProvider(preferredProviderId?: string): Promise<AiProvider> {
    // If a specific provider is requested, try to use it
    if (preferredProviderId) {
      const provider = this.getProvider(preferredProviderId);
      if (provider) {
        const available = await provider.isAvailable();
        if (available) {
          logger.info(`Using preferred provider: ${provider.name}`);
          return provider;
        }
        logger.warn(`Preferred provider ${provider.name} is not available. Will try fallback.`);
      }
    }
    
    // Try each provider in order of priority
    const priorities = ['openai', 'anthropic', 'gemini', 'local'];
    
    for (const providerId of priorities) {
      const provider = this.getProvider(providerId);
      if (provider) {
        try {
          const available = await provider.isAvailable();
          if (available) {
            logger.info(`Selected provider: ${provider.name}`);
            return provider;
          }
        } catch (error) {
          logger.warn(`Error checking ${providerId} availability: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }
    
    // Fallback to template-based provider
    logger.info('No AI providers available. Using template-based fallback.');
    const fallbackProvider = this.getProvider(DEFAULT_PROVIDER);
    
    if (!fallbackProvider) {
      throw new Error('Critical error: Even fallback provider is unavailable');
    }
    
    return fallbackProvider;
  }
} 
/**
 * Interface defining the contract for AI Providers used in PRD generation
 */
export interface AiProviderOptions {
  temperature?: number;
  maxTokens?: number;
  [key: string]: any; // Allow for provider-specific options
}

export interface PrdGenerationInput {
  productName: string;
  productDescription: string;
  targetAudience: string;
  coreFeatures: string[];
  constraints?: string[];
  templateName?: string;
  additionalContext?: string;
}

export interface AiProvider {
  /**
   * Unique identifier for this provider
   */
  readonly id: string;
  
  /**
   * Display name for this provider
   */
  readonly name: string;

  /**
   * Whether this provider is available (properly configured)
   */
  isAvailable(): Promise<boolean>;
  
  /**
   * Generate a PRD using the AI provider
   * 
   * @param input The PRD generation input parameters
   * @param options Provider-specific options
   * @returns The generated PRD content as a string
   */
  generatePrd(input: PrdGenerationInput, options?: AiProviderOptions): Promise<string>;
}

/**
 * Type for provider configuration from environment/config files
 */
export interface AiProviderConfig {
  id: string;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  [key: string]: any; // Allow for provider-specific config
} 
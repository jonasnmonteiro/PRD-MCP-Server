import { AiProvider, AiProviderConfig, AiProviderOptions, PrdGenerationInput } from './provider.js';
import { logger } from '../../config/logging.js';
import { getTemplate } from '../../storage/templates.js';

/**
 * Fallback provider that uses the original template-based approach
 * This provides backward compatibility and a fallback when AI providers are unavailable
 */
export class TemplateFallbackProvider implements AiProvider {
  readonly id = 'template';
  readonly name = 'Template-based (No AI)';
  
  private config: AiProviderConfig;
  
  constructor(config: AiProviderConfig) {
    this.config = config;
  }
  
  /**
   * Template fallback is always available
   */
  async isAvailable(): Promise<boolean> {
    return true;
  }
  
  /**
   * Generate a PRD using template substitution (non-AI method)
   */
  async generatePrd(input: PrdGenerationInput, options?: AiProviderOptions): Promise<string> {
    try {
      logger.info(`Generating PRD for "${input.productName}" using template fallback`);
      
      // Get the template
      const templateName = input.templateName || 'standard';
      const template = await getTemplate(templateName);
      
      // Simple template variable replacement
      let content = template.content;
      
      // Replace product name
      content = content.replace(/\{\{PRODUCT_NAME\}\}/g, input.productName);
      
      // Replace product description
      content = content.replace(/\{\{PRODUCT_DESCRIPTION\}\}/g, input.productDescription);
      
      // Replace target audience
      content = content.replace(/\{\{TARGET_AUDIENCE\}\}/g, input.targetAudience);
      
      // Replace features list
      const featuresContent = input.coreFeatures.map(feature => `- ${feature}`).join('\n');
      content = content.replace(/\{\{CORE_FEATURES\}\}/g, featuresContent);
      
      // Replace constraints if provided
      if (input.constraints && input.constraints.length > 0) {
        const constraintsContent = input.constraints.map(constraint => `- ${constraint}`).join('\n');
        content = content.replace(/\{\{CONSTRAINTS\}\}/g, constraintsContent);
      } else {
        content = content.replace(/\{\{CONSTRAINTS\}\}/g, 'No specific constraints identified.');
      }
      
      // Replace date
      content = content.replace(/\{\{DATE\}\}/g, new Date().toLocaleDateString());
      
      logger.info(`PRD generated successfully for "${input.productName}" using template fallback`);
      return content;
    } catch (error) {
      logger.error(`Error generating PRD with template: ${error instanceof Error ? error.message : String(error)}`);
      throw new Error(`Failed to generate PRD with template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 
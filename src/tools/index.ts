import { Server as McpServer } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { 
  generatePrdSchema, 
  generatePRD, 
  listAiProviders,
  type GeneratePrdParams 
} from './prd-generator.js';
import { 
  validatePrdSchema, 
  validatePRD, 
  listValidationRules, 
  type ValidatePrdParams 
} from './prd-validator.js';
import { logger } from '../config/logging.js';
import { createTemplateSchema, createTemplate } from './template-creator.js';
import { 
  listTemplatesSchema, listTemplates,
  getTemplateSchema, getTemplate,
  updateTemplateSchema, updateTemplate,
  deleteTemplateSchema, deleteTemplate,
  exportTemplatesSchema, exportTemplates,
  importTemplatesSchema, importTemplates
} from './template-manager.js';
import {
  listAllRulesSchema, listAllRules,
  addRuleSchema, addRule,
  updateRuleSchema, updateRule,
  deleteRuleSchema, deleteRule
} from './validation-rule-manager.js';
import { statsSchema, stats } from './metrics-manager.js';
import { getProviderConfigSchema, getProviderConfig, updateProviderConfigSchema, updateProviderConfig } from './provider-config-manager.js';
import { renderTemplateSchema, renderTemplate } from './render-template.js';
import { healthCheckSchema, healthCheck } from './health-manager.js';
import { getLogsSchema, getLogs } from './logs-manager.js';

/**
 * Register all tools with the MCP server
 * 
 * @param server - The MCP server instance
 */
export function registerTools(server: McpServer) {
  logger.info('Registering PRD Creator tools');
  
  // Register request handler for tool execution
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    // Handle PRD Generator tool
    if (name === 'generate_prd') {
      try {
        // Validate parameters
        const validatedParams = generatePrdSchema.parse(args);
        
        // Generate PRD
        const prd = await generatePRD(
          validatedParams.productName,
          validatedParams.productDescription,
          validatedParams.targetAudience,
          validatedParams.coreFeatures,
          validatedParams.constraints,
          validatedParams.templateName,
          validatedParams.providerId,
          validatedParams.additionalContext,
          validatedParams.providerOptions
        );
        
        return {
          content: [{ type: 'text', text: prd }],
        };
      } catch (error) {
        logger.error(`Error generating PRD: ${error instanceof Error ? error.message : String(error)}`);
        return {
          content: [{ type: 'text', text: `Error generating PRD: ${error instanceof Error ? error.message : 'Unknown error'}` }],
          isError: true,
        };
      }
    }
    
    // Handle PRD Validator tool
    if (name === 'validate_prd') {
      try {
        // Validate parameters
        const validatedParams = validatePrdSchema.parse(args);
        
        // Validate PRD
        const validation = await validatePRD(
          validatedParams.prdContent,
          validatedParams.validationRules
        );
        
        return {
          content: [{ type: 'text', text: JSON.stringify(validation, null, 2) }],
        };
      } catch (error) {
        logger.error(`Error validating PRD: ${error instanceof Error ? error.message : String(error)}`);
        return {
          content: [{ type: 'text', text: `Error validating PRD: ${error instanceof Error ? error.message : 'Unknown error'}` }],
          isError: true,
        };
      }
    }
    
    // Handle list validation rules tool
    if (name === 'list_validation_rules') {
      try {
        const rules = listValidationRules();
        
        return {
          content: [{ type: 'text', text: JSON.stringify(rules, null, 2) }],
        };
      } catch (error) {
        logger.error(`Error listing validation rules: ${error instanceof Error ? error.message : String(error)}`);
        return {
          content: [{ type: 'text', text: `Error listing validation rules: ${error instanceof Error ? error.message : 'Unknown error'}` }],
          isError: true,
        };
      }
    }
    
    // Handle list AI providers tool
    if (name === 'list_ai_providers') {
      try {
        const providers = await listAiProviders();
        
        return {
          content: [{ type: 'text', text: JSON.stringify(providers, null, 2) }],
        };
      } catch (error) {
        logger.error(`Error listing AI providers: ${error instanceof Error ? error.message : String(error)}`);
        return {
          content: [{ type: 'text', text: `Error listing AI providers: ${error instanceof Error ? error.message : 'Unknown error'}` }],
          isError: true,
        };
      }
    }

    // Handle Create Template tool
    if (name === 'create_template') {
      try {
        const validatedParams = createTemplateSchema.parse(args);
        const template = await createTemplate(
          validatedParams.name,
          validatedParams.description,
          validatedParams.content,
          validatedParams.tags
        );
        return { content: [{ type: 'text', text: JSON.stringify(template, null, 2) }] };
      } catch (error) {
        logger.error(`Error creating template: ${error instanceof Error ? error.message : String(error)}`);
        return { content: [{ type: 'text', text: `Error creating template: ${error instanceof Error ? error.message : 'Unknown error'}` }], isError: true };
      }
    }
    
    // Handle List Templates tool
    if (name === 'list_templates') {
      try {
        listTemplatesSchema.parse(args);
        const templates = await listTemplates();
        return { content: [{ type: 'text', text: JSON.stringify(templates, null, 2) }] };
      } catch (error) {
        logger.error(`Error listing templates: ${error instanceof Error ? error.message : String(error)}`);
        return { content: [{ type: 'text', text: `Error listing templates: ${error instanceof Error ? error.message : 'Unknown error'}` }], isError: true };
      }
    }
    
    // Handle Get Template tool
    if (name === 'get_template') {
      try {
        const { idOrName } = getTemplateSchema.parse(args);
        const template = await getTemplate(idOrName);
        return { content: [{ type: 'text', text: JSON.stringify(template, null, 2) }] };
      } catch (error) {
        logger.error(`Error getting template: ${error instanceof Error ? error.message : String(error)}`);
        return { content: [{ type: 'text', text: `Error getting template: ${error instanceof Error ? error.message : 'Unknown error'}` }], isError: true };
      }
    }
    
    // Handle Update Template tool
    if (name === 'update_template') {
      try {
        const { id, name: newName, description, content, tags } = updateTemplateSchema.parse(args);
        const updated = await updateTemplate(id, newName, description, content, tags);
        return { content: [{ type: 'text', text: JSON.stringify(updated, null, 2) }] };
      } catch (error) {
        logger.error(`Error updating template: ${error instanceof Error ? error.message : String(error)}`);
        return { content: [{ type: 'text', text: `Error updating template: ${error instanceof Error ? error.message : 'Unknown error'}` }], isError: true };
      }
    }
    
    // Handle Delete Template tool
    if (name === 'delete_template') {
      try {
        const { id } = deleteTemplateSchema.parse(args);
        await deleteTemplate(id);
        return { content: [{ type: 'text', text: JSON.stringify({ success: true }) }] };
      } catch (error) {
        logger.error(`Error deleting template: ${error instanceof Error ? error.message : String(error)}`);
        return { content: [{ type: 'text', text: `Error deleting template: ${error instanceof Error ? error.message : 'Unknown error'}` }], isError: true };
      }
    }
    
    // Handle Export Templates tool
    if (name === 'export_templates') {
      try {
        const { filePath } = exportTemplatesSchema.parse(args);
        await exportTemplates(filePath);
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, filePath }) }] };
      } catch (error) {
        logger.error(`Error exporting templates: ${error instanceof Error ? error.message : String(error)}`);
        return { content: [{ type: 'text', text: `Error exporting templates: ${error instanceof Error ? error.message : 'Unknown error'}` }], isError: true };
      }
    }
    
    // Handle Import Templates tool
    if (name === 'import_templates') {
      try {
        const { filePath } = importTemplatesSchema.parse(args);
        await importTemplates(filePath);
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, filePath }) }] };
      } catch (error) {
        logger.error(`Error importing templates: ${error instanceof Error ? error.message : String(error)}`);
        return { content: [{ type: 'text', text: `Error importing templates: ${error instanceof Error ? error.message : 'Unknown error'}` }], isError: true };
      }
    }
    
    // Handle List All Rules tool
    if (name === 'list_all_rules') {
      try {
        listAllRulesSchema.parse(args);
        const rules = await listAllRules();
        return { content: [{ type: 'text', text: JSON.stringify(rules, null, 2) }] };
      } catch (error) {
        logger.error(`Error listing validation rules: ${error instanceof Error ? error.message : String(error)}`);
        return { content: [{ type: 'text', text: `Error listing validation rules: ${error instanceof Error ? error.message : 'Unknown error'}` }], isError: true };
      }
    }
    
    // Handle Add Validation Rule tool
    if (name === 'add_validation_rule') {
      try {
        const { id, name: rn, description, pattern } = addRuleSchema.parse(args);
        await addRule(id, rn, description, pattern);
        return { content: [{ type: 'text', text: JSON.stringify({ success: true }) }] };
      } catch (error) {
        logger.error(`Error adding validation rule: ${error instanceof Error ? error.message : String(error)}`);
        return { content: [{ type: 'text', text: `Error adding validation rule: ${error instanceof Error ? error.message : 'Unknown error'}` }], isError: true };
      }
    }
    
    // Handle Update Validation Rule tool
    if (name === 'update_validation_rule') {
      try {
        const { id, name: rn, description, pattern } = updateRuleSchema.parse(args);
        await updateRule(id, rn, description, pattern);
        return { content: [{ type: 'text', text: JSON.stringify({ success: true }) }] };
      } catch (error) {
        logger.error(`Error updating validation rule: ${error instanceof Error ? error.message : String(error)}`);
        return { content: [{ type: 'text', text: `Error updating validation rule: ${error instanceof Error ? error.message : 'Unknown error'}` }], isError: true };
      }
    }
    
    // Handle Delete Validation Rule tool
    if (name === 'delete_validation_rule') {
      try {
        const { id } = deleteRuleSchema.parse(args);
        await deleteRule(id);
        return { content: [{ type: 'text', text: JSON.stringify({ success: true }) }] };
      } catch (error) {
        logger.error(`Error deleting validation rule: ${error instanceof Error ? error.message : String(error)}`);
        return { content: [{ type: 'text', text: `Error deleting validation rule: ${error instanceof Error ? error.message : 'Unknown error'}` }], isError: true };
      }
    }
    
    // Handle Stats tool
    if (name === 'stats') {
      try {
        statsSchema.parse(args);
        const metrics = await stats();
        return { content: [{ type: 'text', text: JSON.stringify(metrics, null, 2) }] };
      } catch (error) {
        logger.error(`Error retrieving stats: ${error instanceof Error ? error.message : String(error)}`);
        return { content: [{ type: 'text', text: `Error retrieving stats: ${error instanceof Error ? error.message : 'Unknown error'}` }], isError: true };
      }
    }
    
    // Handle Get Provider Config tool
    if (name === 'get_provider_config') {
      try {
        getProviderConfigSchema.parse(args);
        const configs = await getProviderConfig();
        return { content: [{ type: 'text', text: JSON.stringify(configs, null, 2) }] };
      } catch (error) {
        logger.error(`Error retrieving provider config: ${error instanceof Error ? error.message : String(error)}`);
        return { content: [{ type: 'text', text: `Error retrieving provider config: ${error instanceof Error ? error.message : 'Unknown error'}` }], isError: true };
      }
    }
    
    // Handle Update Provider Config tool
    if (name === 'update_provider_config') {
      try {
        const { providerId, apiKey, baseUrl, model } = updateProviderConfigSchema.parse(args);
        await updateProviderConfig(providerId, apiKey, baseUrl, model);
        return { content: [{ type: 'text', text: JSON.stringify({ success: true }) }] };
      } catch (error) {
        logger.error(`Error updating provider config: ${error instanceof Error ? error.message : String(error)}`);
        return { content: [{ type: 'text', text: `Error updating provider config: ${error instanceof Error ? error.message : 'Unknown error'}` }], isError: true };
      }
    }
    
    // Unknown tool
    logger.error(`Unknown tool requested: ${name}`);
    return {
      content: [{ type: 'text', text: `Unknown tool: ${name}` }],
      isError: true,
    };
  });
  
  logger.info('All PRD Creator tools registered successfully');
}
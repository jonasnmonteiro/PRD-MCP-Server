#!/usr/bin/env node
import 'dotenv/config';

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { configureLogging, logger } from './config/logging.js';
import { registerTools } from './tools/index.js';
import { registerResources } from './resources/index.js';
import { initializeStorage } from './storage/index.js';

/**
 * Main function to initialize and start the PRD Creator MCP server
 */
async function main() {
  try {
    // Configure logging
    configureLogging();
    logger.info('Starting PRD Creator MCP Server...');
    
    // Initialize storage
    logger.info('Initializing storage...');
    await initializeStorage();
    
    // Create MCP server
    logger.info('Creating MCP server...');
    const server = new Server(
      {
        name: 'PRD Creator',
        version: '0.1.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );
    
    // Register tools and resources
    registerTools(server);
    registerResources(server);
    
    // Register ListTools handler to show available tools
    server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'generate_prd',
          description: 'Generate a Product Requirements Document from a template',
          inputSchema: {
            type: 'object',
            properties: {
              productName: {
                type: 'string',
                description: 'The name of the product'
              },
              productDescription: {
                type: 'string',
                description: 'Description of the product'
              },
              targetAudience: {
                type: 'string',
                description: 'Description of the target audience'
              },
              coreFeatures: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description: 'Array of core feature descriptions'
              },
              constraints: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description: 'Optional array of constraints or limitations'
              },
              templateName: {
                type: 'string',
                description: 'Optional template name to use (defaults to "standard")'
              }
            },
            required: ['productName', 'productDescription', 'targetAudience', 'coreFeatures']
          }
        },
        {
          name: 'validate_prd',
          description: 'Validate a PRD against best practices',
          inputSchema: {
            type: 'object',
            properties: {
              prdContent: {
                type: 'string',
                description: 'The PRD content to validate'
              },
              validationRules: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description: 'Optional array of validation rule IDs to check'
              }
            },
            required: ['prdContent']
          }
        },
        {
          name: 'list_validation_rules',
          description: 'List all available validation rules',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'list_ai_providers',
          description: 'List all available AI providers and their availability status',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'create_template',
          description: 'Create a new PRD template',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Name of the new template' },
              description: { type: 'string', description: 'Optional description of the template' },
              content: { type: 'string', description: 'Markdown content of the template' },
              tags: { type: 'array', items: { type: 'string' }, description: 'Optional tags for the template' }
            },
            required: ['name', 'content']
          }
        },
        {
          name: 'list_templates',
          description: 'List all non-deleted PRD templates',
          inputSchema: { type: 'object', properties: {} }
        },
        {
          name: 'get_template',
          description: 'Get a PRD template by ID or name',
          inputSchema: {
            type: 'object',
            properties: { idOrName: { type: 'string', description: 'Template ID or name' } },
            required: ['idOrName']
          }
        },
        {
          name: 'update_template',
          description: 'Update an existing PRD template',
          inputSchema: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Template ID to update' },
              name: { type: 'string', description: 'New template name' },
              description: { type: 'string', description: 'New description' },
              content: { type: 'string', description: 'New markdown content' },
              tags: { type: 'array', items: { type: 'string' }, description: 'New tags' }
            },
            required: ['id']
          }
        },
        {
          name: 'delete_template',
          description: 'Soft-delete a PRD template by ID',
          inputSchema: {
            type: 'object',
            properties: { id: { type: 'string', description: 'Template ID to delete' } },
            required: ['id']
          }
        },
        {
          name: 'export_templates',
          description: 'Export all PRD templates to a JSON file',
          inputSchema: {
            type: 'object',
            properties: { filePath: { type: 'string', description: 'Path to write JSON file' } },
            required: ['filePath']
          }
        },
        {
          name: 'import_templates',
          description: 'Import PRD templates from a JSON file',
          inputSchema: {
            type: 'object',
            properties: { filePath: { type: 'string', description: 'Path to read JSON file' } },
            required: ['filePath']
          }
        },
        {
          name: 'list_all_rules',
          description: 'List all validation rules (default + custom)',
          inputSchema: { type: 'object', properties: {} }
        },
        {
          name: 'add_validation_rule',
          description: 'Add a custom validation rule',
          inputSchema: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              pattern: { type: 'string' }
            },
            required: ['id', 'name', 'pattern']
          }
        },
        {
          name: 'update_validation_rule',
          description: 'Update a custom validation rule',
          inputSchema: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              pattern: { type: 'string' }
            },
            required: ['id']
          }
        },
        {
          name: 'delete_validation_rule',
          description: 'Delete a custom validation rule',
          inputSchema: {
            type: 'object',
            properties: { id: { type: 'string' } },
            required: ['id']
          }
        },
        {
          name: 'stats',
          description: 'Retrieve usage metrics for operations',
          inputSchema: { type: 'object', properties: {} }
        },
        {
          name: 'get_provider_config',
          description: 'Retrieve stored provider configuration overrides',
          inputSchema: { type: 'object', properties: {} }
        },
        {
          name: 'update_provider_config',
          description: 'Update stored provider configuration override',
          inputSchema: {
            type: 'object',
            properties: {
              providerId: { type: 'string' },
              apiKey: { type: 'string' },
              baseUrl: { type: 'string' },
              model: { type: 'string' }
            },
            required: ['providerId']
          }
        },
        {
          name: 'render_template',
          description: 'Render a PRD template with placeholder substitution',
          inputSchema: {
            type: 'object',
            properties: {
              productName: { type: 'string' },
              productDescription: { type: 'string' },
              targetAudience: { type: 'string' },
              coreFeatures: { type: 'array', items: { type: 'string' } },
              constraints: { type: 'array', items: { type: 'string' } },
              templateName: { type: 'string' }
            },
            required: ['productName','productDescription','targetAudience','coreFeatures']
          }
        },
        {
          name: 'health_check',
          description: 'Perform system health check (DB + AI providers)',
          inputSchema: { type: 'object', properties: {} }
        },
        {
          name: 'get_logs',
          description: 'Retrieve recent log entries from disk',
          inputSchema: {
            type: 'object',
            properties: {
              fileName: { type: 'string' },
              lines: { type: 'integer' }
            }
          }
        }
      ]
    }));
    
    // Set up error handling
    server.onerror = (error) => {
      logger.error('Server error:', error);
    };
    
    // Connect using STDIO transport
    logger.info('Connecting server with STDIO transport...');
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    logger.info('PRD Creator MCP Server running with STDIO transport');
  } catch (error) {
    logger.error(`Fatal error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

// Start the server
main();
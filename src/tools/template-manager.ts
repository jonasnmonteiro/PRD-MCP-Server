import { z } from 'zod';
import { logger } from '../config/logging.js';
import {
  listTemplates as storageListTemplates,
  getTemplate as storageGetTemplate,
  updateTemplate as storageUpdateTemplate,
  deleteTemplate as storageDeleteTemplate,
  exportTemplates as storageExportTemplates,
  importTemplates as storageImportTemplates,
} from '../storage/templates.js';

/**
 * List all non-deleted templates
 */
export const listTemplatesSchema = z.object({});
export async function listTemplates() {
  try {
    const templates = await storageListTemplates();
    return templates;
  } catch (error) {
    logger.error(`Error listing templates: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to list templates: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get a single template by name or ID
 */
export const getTemplateSchema = z.object({
  idOrName: z.string().min(1, 'Template ID or name is required'),
});
export async function getTemplate(idOrName: string) {
  try {
    const template = await storageGetTemplate(idOrName);
    return template;
  } catch (error) {
    logger.error(`Error getting template: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to get template: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Update an existing template
 */
export const updateTemplateSchema = z.object({
  id: z.string().min(1, 'Template ID is required'),
  name: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
export async function updateTemplate(
  id: string,
  name?: string,
  description?: string,
  content?: string,
  tags?: string[]
) {
  try {
    const updated = await storageUpdateTemplate(id, { name, description, content, tags });
    return updated;
  } catch (error) {
    logger.error(`Error updating template: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to update template: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Soft-delete a template
 */
export const deleteTemplateSchema = z.object({
  id: z.string().min(1, 'Template ID is required'),
});
export async function deleteTemplate(id: string) {
  try {
    await storageDeleteTemplate(id);
    return { success: true };
  } catch (error) {
    logger.error(`Error deleting template: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to delete template: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Export templates to JSON file on disk
 */
export const exportTemplatesSchema = z.object({
  filePath: z.string().min(1, 'File path is required'),
});
export async function exportTemplates(filePath: string) {
  try {
    await storageExportTemplates(filePath);
    return { success: true, filePath };
  } catch (error) {
    logger.error(`Error exporting templates: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to export templates: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Import templates from JSON file on disk
 */
export const importTemplatesSchema = z.object({
  filePath: z.string().min(1, 'File path is required'),
});
export async function importTemplates(filePath: string) {
  try {
    await storageImportTemplates(filePath);
    return { success: true, filePath };
  } catch (error) {
    logger.error(`Error importing templates: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to import templates: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 
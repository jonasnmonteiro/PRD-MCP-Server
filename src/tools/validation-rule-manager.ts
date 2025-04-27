import { z } from 'zod';
import { logger } from '../config/logging.js';
import {
  listCustomRules,
  getCustomRule,
  addCustomRule,
  updateCustomRule,
  deleteCustomRule,
} from '../storage/validation-rules.js';
import { listValidationRules as listDefaultRules, validatePRD as baseValidatePRD } from './prd-validator.js';

/**
 * List all validation rules (default + custom)
 */
export const listAllRulesSchema = z.object({});
export async function listAllRules() {
  try {
    const defaultRules = listDefaultRules().map(r => ({ id: r.id, name: r.name, description: r.description }));
    const custom = await listCustomRules();
    const customRules = custom.map(r => ({ id: r.id, name: r.name, description: r.description }));
    return [...defaultRules, ...customRules];
  } catch (error) {
    logger.error(`Error listing validation rules: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to list validation rules: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Add a custom validation rule
 */
export const addRuleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  pattern: z.string().min(1),
});
export async function addRule(id: string, name: string, description: string | undefined, pattern: string) {
  try {
    await addCustomRule({ id, name, description, pattern });
    return { success: true };
  } catch (error) {
    logger.error(`Error adding validation rule: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to add validation rule: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Update a custom validation rule
 */
export const updateRuleSchema = z.object({
  id: z.string().min(1),
  name: z.string().optional(),
  description: z.string().optional(),
  pattern: z.string().optional(),
});
export async function updateRule(id: string, name?: string, description?: string, pattern?: string) {
  try {
    const existing = await getCustomRule(id);
    if (!existing) throw new Error(`Rule not found: ${id}`);
    const updated = {
      id,
      name: name ?? existing.name,
      description: description ?? existing.description,
      pattern: pattern ?? existing.pattern,
    };
    await updateCustomRule(updated);
    return { success: true };
  } catch (error) {
    logger.error(`Error updating validation rule: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to update validation rule: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete a custom validation rule
 */
export const deleteRuleSchema = z.object({
  id: z.string().min(1),
});
export async function deleteRule(id: string) {
  try {
    await deleteCustomRule(id);
    return { success: true };
  } catch (error) {
    logger.error(`Error deleting validation rule: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Failed to delete validation rule: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate PRD against selected rules (default + custom)
 */
export const validatePrdExtendedSchema = z.object({
  prdContent: z.string().min(1),
  ruleIds: z.array(z.string()).optional(),
});
export async function validatePrdExtended(prdContent: string, ruleIds?: string[]) {
  // combine default and custom validation logics
  // For simplicity, reuse base validatePRD (only default rules), future: incorporate custom patterns
  return await baseValidatePRD(prdContent, ruleIds);
} 
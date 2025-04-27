import { DbInterface, getPromisifiedDb } from './db.js';

export interface ValidationRuleRow {
  id: string;
  name: string;
  description?: string;
  pattern: string;
}

/**
 * List all custom validation rules from the database.
 */
export async function listCustomRules(): Promise<ValidationRuleRow[]> {
  const db = getPromisifiedDb();
  const rows = await db.all<ValidationRuleRow>(
    `SELECT id, name, description, pattern FROM validation_rules ORDER BY id`
  );
  return rows;
}

/**
 * Get a single custom validation rule by ID.
 */
export async function getCustomRule(id: string): Promise<ValidationRuleRow | null> {
  const db = getPromisifiedDb();
  const row = await db.get<ValidationRuleRow>(
    `SELECT id, name, description, pattern FROM validation_rules WHERE id = ?`,
    [id]
  );
  return row || null;
}

/**
 * Add a new custom validation rule.
 */
export async function addCustomRule(rule: ValidationRuleRow): Promise<void> {
  const db = getPromisifiedDb();
  await db.run(
    `INSERT INTO validation_rules (id, name, description, pattern) VALUES (?, ?, ?, ?)`,
    [rule.id, rule.name, rule.description || null, rule.pattern]
  );
}

/**
 * Update an existing custom validation rule.
 */
export async function updateCustomRule(rule: ValidationRuleRow): Promise<void> {
  const db = getPromisifiedDb();
  await db.run(
    `UPDATE validation_rules SET name = ?, description = ?, pattern = ? WHERE id = ?`,
    [rule.name, rule.description || null, rule.pattern, rule.id]
  );
}

/**
 * Delete a custom validation rule by ID.
 */
export async function deleteCustomRule(id: string): Promise<void> {
  const db = getPromisifiedDb();
  await db.run(`DELETE FROM validation_rules WHERE id = ?`, [id]);
} 
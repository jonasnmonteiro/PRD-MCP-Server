# Active Context: PRD Creator MCP Server

## Current Work Focus
Integration of a robust, multi-provider AI system for PRD generation.

## Recent Changes (Major)
-   **Storage Layer Migrations**: Added a `deleted` column to `templates` table and created `validation_rules` and `metrics` tables in the SQLite database.
-   **Storage Modules**: Introduced `src/storage/validation-rules.ts`, `src/storage/metrics.ts`, and `src/storage/provider-config.ts` for custom rules, usage metrics, and provider configuration.
-   **Template Management Tools**: Added new MCP tools: `create_template`, `list_templates`, `get_template`, `update_template`, `delete_template`, `export_templates`, and `import_templates`.
-   **Validation-Rule Management Tools**: Added MCP tools for `list_all_rules`, `add_validation_rule`, `update_validation_rule`, and `delete_validation_rule` to manage custom validation rules at runtime.
-   **Metrics & Usage Tracking**: Introduced a `stats` tool and instrumented PRD generation (`prd_generated`), AI calls (`ai_calls`), and fallback counts (`fallbacks`), plus template creation, to update the `metrics` table.
-   **Provider Configuration Management**: Added MCP tools `get_provider_config` and `update_provider_config`, with overrides persisted in `data/provider-config.json` via a new storage module.
-   **Template Preview**: Added a `render_template` tool for placeholder-only PRD rendering using the existing fallback logic.
-   **System Diagnostics Tools**: Added `health_check` (database connectivity and AI provider availability) and `get_logs` (tail recent log entries) tools.
-   **Tool Registration Updates**: Updated `src/tools/index.ts` and the ListTools handler in `src/index.ts` to register and expose all new tools.
-   **Memory Bank Update**: Reviewed and updated Memory Bank files for accuracy and completeness.

## Next Steps
1.  **Implement Stub Providers**: Flesh out the implementations for `GeminiProvider`, `AnthropicProvider`, and `LocalModelProvider` (requires installing respective SDKs/libraries and handling their specific API calls).
2.  **Testing**: Add comprehensive unit and integration tests for the AI provider system, including testing each provider and the fallback logic.
3.  **Refine Prompts**: Iterate on the system and user prompts used in AI providers (like `OpenAiProvider`) for optimal PRD quality and structure.
4.  **Error Handling**: Enhance error handling, especially around provider API calls (rate limits, specific API errors).
5.  **Resource Handling Refactor**: Review and potentially refactor resource handling (`prd://` URIs) for clarity if it wasn't updated during the MVP phase (as noted in `systemPatterns.md`).

## Active Decisions & Considerations
-   The current priority is ensuring the core AI provider abstraction works reliably with OpenAI and the template fallback.
-   Implementation of other providers depends on project needs and availability of SDKs/API access.
-   Local model provider implementation will require defining a standard way to interact with Ollama/LM Studio APIs. 
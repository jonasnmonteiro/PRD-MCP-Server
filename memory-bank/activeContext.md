# Active Context: PRD Creator MCP Server

## Current Work Focus
Integration of a robust, multi-provider AI system for PRD generation.

## Recent Changes (Major)
-   **AI Provider Abstraction**: Implemented a core abstraction layer (`src/core/ai-providers/`) allowing multiple AI services (OpenAI, Gemini, Anthropic, local, template fallback) to be used for PRD generation.
-   **OpenAI Implementation**: Fully implemented the `OpenAiProvider` using the official Node.js SDK.
-   **Stub Providers**: Created stub implementations for Gemini, Anthropic, and local models as placeholders.
-   **Template Fallback**: Created a `TemplateFallbackProvider` that uses the original template substitution logic.
-   **Provider Management**: Added an `AiProviderManager` to handle provider selection (based on configuration, preference, and availability), caching, and listing.
-   **Configuration**: Added environment variable support (`src/config/ai-providers.ts` and `.env.template`) for configuring API keys, models, and default providers.
-   **Tool Enhancement**: 
    *   Modified the `generate_prd` tool to accept `providerId`, `additionalContext`, and `providerOptions`.
    *   Added a new `list_ai_providers` tool.
-   **Dependencies**: Added the `openai` npm package.
-   **Documentation**: Updated `README.md` to reflect the new AI capabilities and configuration.

## Next Steps
1.  **Implement Stub Providers**: Flesh out the implementations for `GeminiProvider`, `AnthropicProvider`, and `LocalModelProvider` (requires installing respective SDKs/libraries and handling their specific API calls).
2.  **Testing**: Add comprehensive unit and integration tests for the AI provider system, including testing each provider and the fallback logic.
3.  **Refine Prompts**: Iterate on the system and user prompts used in AI providers (like `OpenAiProvider`) for optimal PRD quality and structure.
4.  **Error Handling**: Enhance error handling, especially around provider API calls (rate limits, specific API errors).
5.  **Resource Handling Refactor**: Review and potentially refactor resource handling (`prd://` URIs) for clarity if it wasn't updated during the MVP phase (as noted in `systemPatterns.md`).
6.  **Memory Bank Refinement**: Review and update all Memory Bank files to ensure accuracy and completeness after these major changes.

## Active Decisions & Considerations
-   The current priority is ensuring the core AI provider abstraction works reliably with OpenAI and the template fallback.
-   Implementation of other providers depends on project needs and availability of SDKs/API access.
-   Local model provider implementation will require defining a standard way to interact with Ollama/LM Studio APIs. 
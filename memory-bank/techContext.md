# Technical Context: PRD Creator MCP Server

## Core Technologies
-   **Runtime**: Node.js (v16+ recommended)
-   **Language**: TypeScript (compiled to JavaScript for `dist/`)
-   **Package Manager**: npm
-   **Protocol Framework**: `@modelcontextprotocol/sdk`
-   **Input Validation**: Zod
-   **Database**: SQLite (via `sqlite3`)
-   **Logging**: Winston
-   **AI Provider SDKs**:
    -   `openai` (for OpenAI)
    -   *(Stubs currently exist for Gemini, Anthropic, Local - SDKs would be added when implemented)*
-   **Development Dependencies**: Jest (Testing), ESLint, Prettier

## Development Setup
1.  **Prerequisites**: Node.js v16+, npm.
2.  **Clone**: `git clone <repository_url>`
3.  **Install Dependencies**: `npm install`
4.  **Configuration**: 
    *   Create a `.env` file in the root directory and set required environment variables, especially AI provider API keys (e.g., `OPENAI_API_KEY`).
    *   Copy `.env.template` to `.env`.
5.  **Build**: `npm run build` (compiles TypeScript to JavaScript in `dist/`)
6.  **Run**: `npm start` (executes `node dist/index.js`)
7.  **Run in Inspector**: `npx @modelcontextprotocol/inspector node dist/index.js`
8.  **Testing**: `npm test`

## Technical Constraints & Considerations
-   **Deployment**: Currently designed to run as a local process, communicating via STDIO. Dockerfile provided for containerization.
-   **Scalability**: SQLite is suitable for single-user or low-concurrency scenarios typical of local MCP server usage. High-concurrency deployments might require migrating to a more robust database (e.g., PostgreSQL).
-   **AI Provider Costs**: Using cloud-based AI providers (OpenAI, Anthropic, Gemini) incurs costs based on usage.
-   **Error Handling**: Relies on try-catch blocks within tool handlers and provider implementations. Errors are logged and returned to the MCP client as error messages.
-   **Security**: API keys are read from environment variables. Care must be taken not to expose the `.env` file or log keys.

## Dependencies
-   `@modelcontextprotocol/sdk`: Core dependency for MCP functionality.
-   `zod`: Used extensively for defining and validating schemas for tool inputs.
-   `winston`: For logging application events and errors.
-   `better-sqlite3`: For interacting with the SQLite database storing templates.
-   `openai`: Node.js client library for the OpenAI API. 
# Contributing to PRD Creator MCP Server

Thank you for considering contributing to **PRD Creator MCP Server**! We welcome contributions of all kinds, including bug reports, feature requests, documentation improvements, and code enhancements.

## Code of Conduct

Before you begin, please review our [Code of Conduct](CODE_OF_CONDUCT.md). We expect all participants to adhere to its guidelines.

## How to Contribute

1.  Fork the repository on GitHub: https://github.com/Saml1211/prd-mcp-server/fork
2.  Clone your fork locally:
    ```bash
    git clone https://github.com/Saml1211/prd-mcp-server.git
    cd prd-mcp-server
    ```
3.  Create a new branch for your feature or bugfix:
    ```bash
    git checkout -b feature/your-feature-name
    ```
4.  Install dependencies and run tests:
    ```bash
    npm install
    npm test
    ```
5.  Make your changes and ensure code style is consistent:
    ```bash
    npm run lint
    npm run format
    ```
6.  Commit your changes with a clear, descriptive commit message.
7.  Push your branch to GitHub:
    ```bash
    git push origin feature/your-feature-name
    ```
8.  Open a Pull Request against the `main` branch of the original repository.

## Reporting Issues

- Use the [issue tracker](https://github.com/Saml1211/prd-mcp-server/issues) to report bugs or suggest features.
- Provide a clear description, steps to reproduce, and expected versus actual behavior.

## Pull Request Guidelines

- Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.
- Ensure all CI checks pass before requesting a review.
- Add or update tests as appropriate.
- Reference related issues in your PR description.

## Development Workflow

- Feature branches should be named `feature/<feature-name>`.
- Bugfix branches should be named `fix/<issue-number>-<short-description>`.
- Keep branches focused on a single concern.

Thank you for helping make PRD Creator MCP Server better! 
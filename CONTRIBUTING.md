# Contributing to mcp-schema-server

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mcp-schema-server.git
   cd mcp-schema-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

## Project Structure

- `src/` - TypeScript source code
  - `index.ts` - Main entry point, exports public API
  - `mcp-wrapper.ts` - Core GenericMcpPlugin implementation
- `dist/` - Compiled JavaScript (generated, not committed)
- `examples/` - Example implementations
- `scripts/` - Build and validation scripts

## Making Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Edit TypeScript files in `src/`
   - Follow existing code style
   - Add JSDoc comments for public APIs

3. **Build and test**
   ```bash
   npm run build
   npm run check
   ```

4. **Update documentation**
   - Update `README.md` if adding features
   - Update `CHANGELOG.md` with your changes
   - Add examples if applicable

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: description of your change"
   ```

## Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Build process or tooling changes

Examples:
- `feat: add support for custom validators`
- `fix: handle undefined manifest schemas`
- `docs: update API reference for handlers`

## Code Style

- Use TypeScript with strict mode
- Follow existing formatting conventions
- Use meaningful variable and function names
- Add types for all parameters and return values
- Keep functions focused and single-purpose

## Testing

Currently, tests are manual. To test your changes:

1. Build the library: `npm run build`
2. Test with the example: `cd examples/employee-directory && npm install && npm run build`
3. Run the example server and verify functionality

## Adding Examples

To add a new example:

1. Create a new directory in `examples/`
2. Include:
   - `server.ts` - Server implementation
   - `manifest.json` - MCP manifest
   - `package.json` - Dependencies
   - `tsconfig.json` - TypeScript config
   - `README.md` - Example documentation

## Pull Request Process

1. **Update documentation** - Ensure README and CHANGELOG are updated
2. **Run checks** - `npm run check` must pass
3. **Create PR** - Open a pull request with a clear description
4. **Address feedback** - Respond to review comments
5. **Wait for approval** - Maintainer will review and merge

## Questions?

Open an issue for:
- Bug reports
- Feature requests
- Usage questions
- Documentation improvements

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

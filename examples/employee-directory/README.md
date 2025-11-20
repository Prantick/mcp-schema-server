# Employee Directory Example

This example demonstrates how to create an MCP server using `mcp-schema-server` for managing an employee directory.

## Features

- **Tools**: Get employee by ID, add new employees
- **Resources**: Access all employees list
- **Prompts**: Generate team summaries by department

## Running the Example

```bash
# Install dependencies
npm install

# Build the TypeScript code
npx tsc

# Run the server
node server.js
```

## How It Works

1. Define your data model in `data.ts`
2. Create a `manifest.json` with your tools, resources, and prompts
3. Implement handler functions for each tool/resource/prompt
4. Initialize `GenericMcpPlugin` with the manifest and handlers
5. Start the server!

See `server.ts` for the full implementation.

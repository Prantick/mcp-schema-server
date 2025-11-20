# mcp-schema-server

A zero-config MCP server framework that generates a fully functional Model Context Protocol server directly from a simple manifest.json schema. Define your tools, prompts, resources, and metadata once, and `mcp-schema-server` instantly transforms it into a ready-to-use MCP server with no manual coding required.

[![npm version](https://badge.fury.io/js/mcp-schema-server.svg)](https://www.npmjs.com/package/mcp-schema-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

✨ **Zero Configuration** - Just define your manifest and handlers  
🔒 **Type-Safe** - Built with TypeScript for full type safety  
✅ **Schema Validation** - Automatic input validation using JSON Schema (AJV)  
🚀 **Quick Setup** - Get a production-ready MCP server in minutes  
📦 **Lightweight** - Minimal dependencies, maximum functionality  

## Installation

```bash
npm install mcp-schema-server
```

## Quick Start

### 1. Create a Manifest File

Create a `manifest.json` file defining your tools, resources, and prompts:

```json
{
  "tools": [
    {
      "name": "get_user",
      "description": "Get user details by ID",
      "inputSchema": {
        "type": "object",
        "properties": {
          "id": { "type": "string" }
        },
        "required": ["id"]
      }
    }
  ],
  "resources": [
    {
      "uri": "user://all",
      "name": "All Users",
      "mimeType": "application/json",
      "description": "List of all users"
    }
  ],
  "prompts": [
    {
      "name": "analyze_user",
      "description": "Generate user analysis",
      "arguments": [
        {
          "name": "userId",
          "description": "The user ID to analyze",
          "required": true
        }
      ]
    }
  ]
}
```

### 2. Create Your Server

Create a `server.ts` file:

```typescript
import { GenericMcpPlugin } from "mcp-schema-server";
import * as path from "path";

// Define your handler functions
const handlers = {
  // Tool handlers
  "get_user": async (args: { id: string }) => {
    // Your business logic here
    return { id: args.id, name: "John Doe", email: "john@example.com" };
  },
  
  // Resource handlers (use the URI as the key)
  "user://all": async () => {
    return [
      { id: "1", name: "John Doe" },
      { id: "2", name: "Jane Smith" }
    ];
  },
  
  // Prompt handlers
  "analyze_user": async (args: { userId: string }) => {
    return `Please analyze the behavior of user ${args.userId}`;
  }
};

// Initialize and start the server
const plugin = new GenericMcpPlugin({
  name: "my-mcp-server",
  version: "1.0.0",
  manifestPath: path.join(__dirname, "manifest.json"),
  handlers: handlers
});

plugin.start();
```

### 3. Build and Run

```bash
# Build TypeScript
npx tsc

# Run your server
node dist/server.js
```

## API Reference

### `GenericMcpPlugin`

The main class for creating an MCP server.

#### Constructor Options

```typescript
interface PluginConfig {
  manifestPath: string;  // Path to your manifest.json file
  name: string;          // Server name
  version: string;       // Server version
  handlers: Record<string, ActionHandler>;  // Map of handlers
}
```

#### Handler Function Type

```typescript
type ActionHandler = (args: any) => Promise<any> | any;
```

Handlers can be synchronous or asynchronous functions that:
- Receive validated arguments based on your manifest schema
- Return any JSON-serializable data
- Can throw errors that will be caught and returned to the client

### Special Return Types

#### Image Responses

To return images (e.g., charts, diagrams), use the `McpContent` type:

```typescript
import { McpContent } from "mcp-schema-server";

const generateChart = async (): Promise<McpContent> => {
  const base64Image = "..."; // your base64 encoded image
  return {
    type: "image",
    data: base64Image,
    mimeType: "image/png"
  };
};
```

#### Text Responses

Regular objects and primitives are automatically serialized as JSON text:

```typescript
const getUser = async (args: { id: string }) => {
  return { id: args.id, name: "John" }; // Auto-converted to JSON
};
```

## Manifest Schema

### Tools

Define callable functions with input validation:

```json
{
  "tools": [
    {
      "name": "tool_name",
      "description": "What this tool does",
      "inputSchema": {
        "type": "object",
        "properties": {
          "param1": { "type": "string" },
          "param2": { "type": "number" }
        },
        "required": ["param1"]
      }
    }
  ]
}
```

### Resources

Define accessible data resources:

```json
{
  "resources": [
    {
      "uri": "scheme://resource-id",
      "name": "Display Name",
      "mimeType": "application/json",
      "description": "Resource description"
    }
  ]
}
```

### Prompts

Define prompt templates:

```json
{
  "prompts": [
    {
      "name": "prompt_name",
      "description": "What this prompt does",
      "arguments": [
        {
          "name": "arg1",
          "description": "Argument description",
          "required": true
        }
      ]
    }
  ]
}
```

## Features in Detail

### Automatic Input Validation

All tool inputs are automatically validated against your JSON Schema:

```typescript
// If manifest specifies "id" must be a string and is required,
// this is validated BEFORE your handler is called
const getEmployee = (args: { id: string }) => {
  // args.id is guaranteed to be a string here
  return employees.find(e => e.id === args.id);
};
```

### Startup Integrity Checks

On startup, the framework verifies:
- ✅ Every manifest tool has a corresponding handler
- ✅ Every manifest resource has a corresponding handler
- ✅ Every manifest prompt has a corresponding handler

If any handlers are missing, you'll get a clear error message:

```
[MCP Startup Error] Missing handlers for:
 - Tool: get_employee
 - Resource: employee://all
Please add these to your handlers map.
```

### Error Handling

Errors in your handlers are automatically caught and returned to the client:

```typescript
const getUser = (args: { id: string }) => {
  const user = users.find(u => u.id === args.id);
  if (!user) {
    throw new Error(`User ${args.id} not found`);
  }
  return user;
};
// Error messages are automatically sent back to the client
```

## Examples

Check out the [`examples/`](./examples) directory for complete working examples:

- **[Employee Directory](./examples/employee-directory)** - Full-featured example with tools, resources, and prompts

## Best Practices

1. **Keep handlers pure** - Avoid side effects when possible
2. **Use TypeScript** - Get full type safety for your handlers
3. **Validate at the schema level** - Let JSON Schema handle input validation
4. **Use meaningful names** - Make your tool/resource/prompt names descriptive
5. **Document your manifest** - Use clear descriptions for better LLM understanding
6. **Handle errors gracefully** - Throw descriptive errors for better debugging


## Adapter Pattern (Developer-friendly)

Applying the Adapter Pattern reduces MCP boilerplate and makes handlers easier to write and reuse:

- **Radical Simplification of Business Logic:** Keep your business functions (e.g., `getEmployee`, `addEmployee`) pure — they accept arguments and return data. This makes unit testing and reuse across other interfaces (REST, CLI) trivial.
- **Configuration over Convention:** Move interface definitions (descriptions, schemas) into `manifest.json` so you can update what the LLM sees without changing TypeScript handlers.
- **Solves the "Strictness" Friction:** The adapter automates MCP SDK response wrapping (the `{ content: [{ type: "text", text: ... }] }` shape), letting handlers return plain JSON for the common 95% case.
## TypeScript Support

This package is built with TypeScript and includes full type definitions. You get:

- Type inference for handler arguments based on your manifest
- Autocomplete for API methods
- Compile-time type checking

```typescript
import { GenericMcpPlugin, McpContent } from "mcp-schema-server";

// Full TypeScript support
const plugin = new GenericMcpPlugin({
  name: "my-server",
  version: "1.0.0",
  manifestPath: "./manifest.json",
  handlers: {
    // TypeScript will help you here
  }
});
```

## Publishing Your Server

Once you've built your MCP server:

1. Test it locally with MCP clients like Claude Desktop
2. Publish to npm: `npm publish`
3. Users can install and use: `npm install your-mcp-server`

## Requirements

- Node.js >= 18.0.0
- TypeScript >= 5.0 (for development)

## License

MIT © Prantick Das

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

- 📖 [Documentation](./README.md)
- 💬 [Issues](https://github.com/yourusername/mcp-schema-server/issues)


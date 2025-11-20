# Quick Usage Guide

## Installation

```bash
npm install mcp-schema-server
```

## Basic Usage

### 1. Create manifest.json

```json
{
  "tools": [
    {
      "name": "my_tool",
      "description": "Description of the tool",
      "inputSchema": {
        "type": "object",
        "properties": {
          "param": { "type": "string" }
        },
        "required": ["param"]
      }
    }
  ]
}
```

### 2. Create server.ts

```typescript
import { GenericMcpPlugin } from "mcp-schema-server";

const plugin = new GenericMcpPlugin({
  name: "my-server",
  version: "1.0.0",
  manifestPath: "./manifest.json",
  handlers: {
    "my_tool": async (args) => {
      return { result: `Processed: ${args.param}` };
    }
  }
});

plugin.start();
```

### 3. Build and Run

```bash
npx tsc
node dist/server.js
```

## Handler Types

### Tools
```typescript
handlers: {
  "tool_name": async (args: { param: string }) => {
    return { data: "your result" };
  }
}
```

### Resources (use URI as key)
```typescript
handlers: {
  "resource://uri": async () => {
    return { data: "resource data" };
  }
}
```

### Prompts
```typescript
handlers: {
  "prompt_name": async (args: { param: string }) => {
    return "Your prompt template text";
  }
}
```

## Return Types

### JSON (default)
```typescript
return { any: "object" }; // Auto-serialized
```

### Images
```typescript
import { McpContent } from "mcp-schema-server";

return {
  type: "image",
  data: base64ImageString,
  mimeType: "image/png"
} as McpContent;
```

## Error Handling

```typescript
handlers: {
  "my_tool": async (args) => {
    if (!valid) {
      throw new Error("Custom error message");
    }
    return result;
  }
}
```

Errors are automatically caught and sent to the client.

## TypeScript Types

```typescript
import type { 
  PluginConfig, 
  ActionHandler, 
  McpContent 
} from "mcp-schema-server";

const config: PluginConfig = {
  name: "my-server",
  version: "1.0.0",
  manifestPath: "./manifest.json",
  handlers: {}
};
```

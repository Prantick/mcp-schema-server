// Main library exports
export { GenericMcpPlugin } from "./mcp-wrapper.js";
export type { McpContent, PluginConfig, ActionHandler } from "./mcp-wrapper.js";

// Re-export types from the SDK that users might need
export type {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
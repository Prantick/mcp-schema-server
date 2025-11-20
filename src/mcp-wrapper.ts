import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs";
import { Ajv } from "ajv";


export interface McpContent {
  type: "image" | "text";
  data?: string;
  mimeType?: string;
  text?: string;
}

export type ActionHandler = (args: any) => Promise<any> | any;

export interface PluginConfig {
  manifestPath: string;
  name: string;
  version: string;
  handlers: Record<string, ActionHandler>;
}

export class GenericMcpPlugin {
  private mcpServer: McpServer;
  private manifest: any;
  private handlers: Record<string, ActionHandler>;
  private ajv: Ajv;

  constructor(config: PluginConfig) {
    this.handlers = config.handlers;
    this.ajv = new Ajv();

    // Load Manifest
    const rawData = fs.readFileSync(config.manifestPath, "utf-8");
    this.manifest = JSON.parse(rawData);

    // Ensure all Manifest items have a matching Handler
    this.validateIntegrity();

    this.mcpServer = new McpServer(
      { name: config.name, version: config.version },
      { capabilities: { tools: {}, resources: {}, prompts: {} } }
    );

    this.setupHandlers();
  }

  private validateIntegrity() {
    const missingHandlers: string[] = [];
    
    this.manifest.tools?.forEach((t: any) => {
      if (!this.handlers[t.name]) missingHandlers.push(`Tool: ${t.name}`);
    });
    this.manifest.resources?.forEach((r: any) => {
      if (!this.handlers[r.uri]) missingHandlers.push(`Resource: ${r.uri}`);
    });
    this.manifest.prompts?.forEach((p: any) => {
      if (!this.handlers[p.name]) missingHandlers.push(`Prompt: ${p.name}`);
    });

    if (missingHandlers.length > 0) {
      throw new Error(`\n[MCP Startup Error] Missing handlers for:\n - ${missingHandlers.join("\n - ")}\nPlease add these to your handlers map.`);
    }
  }

  private setupHandlers() {
    // --- Tool Handler ---
    this.mcpServer.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.manifest.tools || [],
    }));

    this.mcpServer.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const toolName = request.params.name;
      const args = request.params.arguments || {};
      const handler = this.handlers[toolName];

      if (!handler) {
        throw new McpError(ErrorCode.MethodNotFound, `Tool ${toolName} not found`);
      }

      // Check args against Manifest Schema
      const toolDef = this.manifest.tools.find((t: any) => t.name === toolName);
      if (toolDef && toolDef.inputSchema) {
        const validate = this.ajv.compile(toolDef.inputSchema);
        const valid = validate(args);
        if (!valid) {
          throw new McpError(
            ErrorCode.InvalidParams, 
            `Invalid arguments: ${this.ajv.errorsText(validate.errors)}`
          );
        }
      }

      try {
        const result = await handler(args);
        if (result && typeof result === 'object' && result.type === 'image') {
            return {
                content: [{
                    type: "image",
                    data: result.data,
                    mimeType: result.mimeType
                }]
            };
        }
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };

      } catch (err: any) {
        return {
          content: [{ type: "text", text: `Error: ${err.message}` }],
          isError: true,
        };
      }
    });

    // --- Resource Handler ---
    this.mcpServer.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: this.manifest.resources || [],
    }));

    this.mcpServer.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const uri = request.params.uri;
      const handler = this.handlers[uri];
      if (!handler) throw new McpError(ErrorCode.InvalidRequest, `Resource not found`);
      
      const result = await handler({});
      
      return {
        contents: [{
          uri: uri,
          mimeType: "application/json",
          text: JSON.stringify(result, null, 2),
        }],
      };
    });

    // --- Prompt Handler ---
    this.mcpServer.server.setRequestHandler(ListPromptsRequestSchema, async () => ({
      prompts: this.manifest.prompts || [],
    }));

    this.mcpServer.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const promptName = request.params.name;
      const handler = this.handlers[promptName];
      if (!handler) throw new McpError(ErrorCode.MethodNotFound, `Prompt not found`);

      const result = await handler(request.params.arguments);

      return {
        messages: [
          {
            role: "user",
            content: { type: "text", text: typeof result === 'string' ? result : JSON.stringify(result) },
          },
        ],
      };
    });
  }

  public async start() {
    const transport = new StdioServerTransport();
    await this.mcpServer.connect(transport);
    console.error("MCP Server running on stdio...");
  }
}
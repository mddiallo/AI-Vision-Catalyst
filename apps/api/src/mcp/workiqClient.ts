import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import pino from 'pino';

const logger = pino({ name: 'workiq-client' });

// ── Singleton MCP Client ────────────────────────────────────────────────────────

let client: Client | null = null;
let transport: StdioClientTransport | null = null;
let discoveredTools: Array<{ name: string; description?: string; inputSchema?: any }> = [];
let available = false;

export function isWorkIQAvailable(): boolean {
  return available;
}

export async function connectWorkIQ(): Promise<void> {
  if (client) {
    logger.info('WorkIQ MCP client already connected');
    return;
  }

  try {
    logger.info('Spawning WorkIQ MCP server via: npx -y @microsoft/workiq mcp');

    transport = new StdioClientTransport({
      command: 'npx',
      args: ['-y', '@microsoft/workiq', 'mcp'],
      stderr: 'pipe',
    });

    client = new Client(
      { name: 'azure-vision-catalyst', version: '1.0.0' },
      { capabilities: {} },
    );

    await client.connect(transport);
    logger.info('WorkIQ MCP client connected successfully');

    // Discover available tools
    const result = await client.listTools();
    discoveredTools = (result.tools ?? []).map((t: any) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
    }));

    logger.info({ tools: discoveredTools.map((t) => t.name) }, 'Discovered WorkIQ tools');
    available = true;
  } catch (err: any) {
    logger.error({ err: err.message }, 'Failed to connect to WorkIQ MCP server');
    available = false;
    client = null;
    transport = null;

    if (err.message?.includes('EULA') || err.message?.includes('eula')) {
      throw new Error(
        'WorkIQ EULA not accepted. Run: pnpm --filter api workiq:eula',
      );
    }
    if (err.message?.includes('auth') || err.message?.includes('sign in') || err.message?.includes('login')) {
      throw new Error(
        'WorkIQ authentication required. Run: npx -y @microsoft/workiq mcp — and complete browser sign-in.',
      );
    }
    // Non-fatal: log and continue without WorkIQ
    logger.warn('WorkIQ unavailable — proceeding without org context');
  }
}

export async function disconnectWorkIQ(): Promise<void> {
  if (client) {
    try {
      await client.close();
    } catch {
      // ignore close errors
    }
    client = null;
    transport = null;
    available = false;
    logger.info('WorkIQ MCP client disconnected');
  }
}

// ── Find the best tool for a natural-language question ──────────────────────────

function findQueryTool(): { name: string; paramName: string } | null {
  // Priority: tool named 'ask'
  const askTool = discoveredTools.find((t) => t.name === 'ask');
  if (askTool) {
    const paramName = findStringParam(askTool.inputSchema) ?? 'question';
    return { name: 'ask', paramName };
  }

  // Fallback: first tool with a 'question' string param (higher priority)
  for (const tool of discoveredTools) {
    const schema = tool.inputSchema;
    if (!schema?.properties) continue;
    if (schema.properties.question?.type === 'string') {
      return { name: tool.name, paramName: 'question' };
    }
  }

  // Then: first tool with a 'query' string param
  for (const tool of discoveredTools) {
    const schema = tool.inputSchema;
    if (!schema?.properties) continue;
    if (schema.properties.query?.type === 'string') {
      return { name: tool.name, paramName: 'query' };
    }
  }

  // Last resort: first tool with any string param
  for (const tool of discoveredTools) {
    const paramName = findStringParam(tool.inputSchema);
    if (paramName) {
      return { name: tool.name, paramName };
    }
  }

  return null;
}

function findStringParam(inputSchema: any): string | null {
  if (!inputSchema?.properties) return null;
  for (const [key, val] of Object.entries(inputSchema.properties as Record<string, any>)) {
    if (val.type === 'string') return key;
  }
  return null;
}

// ── Query WorkIQ ────────────────────────────────────────────────────────────────

export interface WorkIQResult {
  answer: string;
  raw: any;
}

export async function queryWorkIQ(question: string): Promise<WorkIQResult> {
  if (!client || !available) {
    throw new Error('WorkIQ MCP client is not connected');
  }

  const tool = findQueryTool();
  if (!tool) {
    throw new Error(
      `No suitable WorkIQ tool found. Discovered tools: ${discoveredTools.map((t) => t.name).join(', ')}`,
    );
  }

  logger.info({ tool: tool.name, question }, 'Calling WorkIQ tool');

  try {
    const result = await client.callTool({
      name: tool.name,
      arguments: { [tool.paramName]: question },
    });

    // Extract text from content array
    const content = result.content as Array<{ type: string; text?: string }>;
    const textParts = content
      ?.filter((c: any) => c.type === 'text' && c.text)
      .map((c: any) => c.text) ?? [];

    const answer = textParts.join('\n\n') || JSON.stringify(result.content);

    return { answer, raw: result };
  } catch (err: any) {
    logger.error({ err: err.message, tool: tool.name }, 'WorkIQ tool call failed');
    throw new Error(`WorkIQ query failed: ${err.message}`);
  }
}

export function getDiscoveredTools() {
  return discoveredTools;
}

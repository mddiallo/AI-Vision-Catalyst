import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the MCP client module before importing
vi.mock('@modelcontextprotocol/sdk/client/index.js', () => {
  const mockCallTool = vi.fn();
  const mockListTools = vi.fn();
  const mockConnect = vi.fn();
  const mockClose = vi.fn();

  return {
    Client: vi.fn().mockImplementation(() => ({
      connect: mockConnect,
      listTools: mockListTools,
      callTool: mockCallTool,
      close: mockClose,
    })),
    StdioClientTransport: vi.fn().mockImplementation(() => ({})),
    __mockConnect: mockConnect,
    __mockListTools: mockListTools,
    __mockCallTool: mockCallTool,
  };
});

describe('WorkIQ Tool Selection Logic', () => {
  it('should select "ask" tool when available', () => {
    const tools = [
      { name: 'list-files', description: 'List files', inputSchema: { properties: { path: { type: 'string' } } } },
      { name: 'ask', description: 'Ask a question', inputSchema: { properties: { question: { type: 'string' } } } },
      { name: 'search', description: 'Search', inputSchema: { properties: { query: { type: 'string' } } } },
    ];

    const result = findQueryToolFromList(tools);
    expect(result).toEqual({ name: 'ask', paramName: 'question' });
  });

  it('should fall back to tool with "question" param', () => {
    const tools = [
      { name: 'search', description: 'Search', inputSchema: { properties: { query: { type: 'string' } } } },
      { name: 'nlquery', description: 'NL Query', inputSchema: { properties: { question: { type: 'string' } } } },
    ];

    const result = findQueryToolFromList(tools);
    expect(result).toEqual({ name: 'nlquery', paramName: 'question' });
  });

  it('should fall back to tool with "query" param', () => {
    const tools = [
      { name: 'search', description: 'Search', inputSchema: { properties: { query: { type: 'string' } } } },
    ];

    const result = findQueryToolFromList(tools);
    expect(result).toEqual({ name: 'search', paramName: 'query' });
  });

  it('should fall back to first tool with any string param', () => {
    const tools = [
      { name: 'custom-tool', description: 'Custom', inputSchema: { properties: { text: { type: 'string' } } } },
    ];

    const result = findQueryToolFromList(tools);
    expect(result).toEqual({ name: 'custom-tool', paramName: 'text' });
  });

  it('should return null when no tools available', () => {
    const result = findQueryToolFromList([]);
    expect(result).toBeNull();
  });

  it('should return null when no tools have string params', () => {
    const tools = [
      { name: 'counter', description: 'Count', inputSchema: { properties: { count: { type: 'number' } } } },
    ];

    const result = findQueryToolFromList(tools);
    expect(result).toBeNull();
  });
});

// Extract the tool selection logic for unit testing
function findQueryToolFromList(
  tools: Array<{ name: string; description?: string; inputSchema?: any }>,
): { name: string; paramName: string } | null {
  // Priority: tool named 'ask'
  const askTool = tools.find((t) => t.name === 'ask');
  if (askTool) {
    const paramName = findStringParam(askTool.inputSchema) ?? 'question';
    return { name: 'ask', paramName };
  }

  // Fallback: first tool with a 'question' string param (higher priority)
  for (const tool of tools) {
    const schema = tool.inputSchema;
    if (!schema?.properties) continue;
    if (schema.properties.question?.type === 'string') {
      return { name: tool.name, paramName: 'question' };
    }
  }

  // Then: first tool with a 'query' string param
  for (const tool of tools) {
    const schema = tool.inputSchema;
    if (!schema?.properties) continue;
    if (schema.properties.query?.type === 'string') {
      return { name: tool.name, paramName: 'query' };
    }
  }

  // Last resort: first tool with any string param
  for (const tool of tools) {
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

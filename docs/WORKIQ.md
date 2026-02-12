# WorkIQ MCP Integration Guide

## What is WorkIQ?

Microsoft Work IQ is a Model Context Protocol (MCP) server that provides access to your Microsoft 365 organizational data — including emails, meetings, Teams chats, documents, and people information. Azure Vision Catalyst uses WorkIQ to enrich project visions with real organizational context.

## How It Works

```
┌──────────────────┐       stdio       ┌──────────────────┐
│  Express API     │◀────────────────▶│  WorkIQ MCP      │
│  (MCP Client)    │                   │  (npx subprocess)│
└──────────────────┘                   └────────┬─────────┘
                                                │
                                                ▼
                                       ┌──────────────────┐
                                       │  Microsoft Graph │
                                       │  (M365 Data)     │
                                       └──────────────────┘
```

1. The API spawns WorkIQ as a subprocess using `npx -y @microsoft/workiq mcp`
2. Communication happens over stdio using the Model Context Protocol
3. The API discovers available tools at runtime via `client.listTools()`
4. Queries are sent using natural language via the discovered tool
5. Responses contain summarized organizational data with citations

## Setup

### Step 1: Accept the EULA

```bash
pnpm --filter @azure-vision-catalyst/api workiq:eula
# or directly:
npx -y @microsoft/workiq accept-eula
```

### Step 2: First-Run Authentication

On first use, WorkIQ will prompt for Microsoft sign-in:

1. A browser window will open automatically
2. Sign in with your Microsoft 365 account
3. Grant the requested permissions
4. Return to the terminal — sign-in tokens are cached for future use

### Step 3: Enable in Configuration

In `apps/api/.env`:

```
WORKIQ_ENABLED=true
```

### Step 4: Verify

Start the API and check:

```bash
curl http://localhost:4000/healthz
# Should return: { "status": "ok", "workiq": true, "azure": true }
```

## Tool Discovery

WorkIQ MCP tools may change across versions (it's in preview). The API dynamically discovers tools at startup:

1. Connects to the MCP server
2. Calls `client.listTools()` to get available tools
3. Looks for a tool named `ask` first
4. Falls back to any tool accepting a `question` or `query` string parameter
5. As a last resort, picks the first tool with any string parameter

This approach ensures compatibility even if tool names change in future WorkIQ releases.

## Troubleshooting

### EULA Not Accepted

```
Error: WorkIQ EULA not accepted
```

**Fix:** Run `npx -y @microsoft/workiq accept-eula` and follow the prompts.

### Authentication Required

```
Error: WorkIQ authentication required
```

**Fix:** Run `npx -y @microsoft/workiq mcp` manually in a terminal, complete the browser sign-in, then restart the API. Authentication tokens are cached locally.

### Tenant Admin Consent Required

Some organizations require an Azure AD administrator to grant consent for WorkIQ to access Microsoft Graph data. If you see a "needs admin approval" error:

1. Contact your IT administrator
2. They need to grant admin consent for the WorkIQ application in Azure AD
3. This is typically done in the Azure Portal → Azure Active Directory → Enterprise Applications
4. See the [WorkIQ documentation](https://github.com/microsoft/work-iq-mcp) for details

### Connection Timeout

```
Error: WorkIQ connection timeout
```

**Fix:**
- Ensure you have network connectivity
- Check if `npx -y @microsoft/workiq mcp` runs successfully in a standalone terminal
- Verify your Microsoft 365 account has active licenses

### Tool Not Found

```
Error: No suitable WorkIQ tool found
```

This happens when WorkIQ's available tools don't match expected patterns. The API logs discovered tools on startup for debugging:

```bash
# Check API logs for tool discovery output
pnpm --filter @azure-vision-catalyst/api dev
# Look for: "Discovered WorkIQ tools: [...]"
```

### Docker Limitations

WorkIQ requires interactive browser-based sign-in on first use. In Docker:

1. **First time:** Run WorkIQ authentication on the host machine first
2. **After auth:** Mount the cached credentials volume into the container
3. **Limitation:** Re-authentication cannot happen inside a container without a browser

For demos, we recommend running WorkIQ-enabled scenarios outside Docker.

## Graceful Degradation

When WorkIQ is unavailable, the API continues to work:

- Health check returns `"workiq": false`
- Vision generation proceeds with empty `orgSignals`  
- The web UI shows a warning badge indicating WorkIQ is not connected
- No errors are thrown — the experience is seamless

## Questions Sent to WorkIQ

For each vision generation, the API sends 5 context-gathering queries:

1. **Recent activity:** Find meeting notes, emails, and documents related to the topic
2. **Decisions:** What decisions were made about the topic recently
3. **Stakeholders:** Who are the key stakeholders and their concerns
4. **Teams discussions:** Summary of Teams chats about the topic
5. **Architecture docs:** Find proposals, diagrams, or RFIs related to the topic

These questions are parameterized with the customer's industry and challenge description.

# Azure Vision Catalyst + WorkIQ

> Transform any business challenge into three actionable Azure project visions — **Conservative**, **Platform**, and **Agentic** — enriched with real organizational context from Microsoft Work IQ.

![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Express](https://img.shields.io/badge/Express-4-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌────────────────────┐
│   Next.js Web   │────▶│  Express API     │────▶│  Azure OpenAI      │
│   (Port 3000)   │     │  (Port 4000)     │     │  (Chat Completions)│
└─────────────────┘     └──────┬───────────┘     └────────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │  WorkIQ MCP      │
                        │  (stdio subprocess)│
                        │  → M365 Graph    │
                        └──────────────────┘
```

**How it works:**
1. User describes a business challenge in the web UI
2. API fetches organizational context from WorkIQ MCP (meetings, emails, docs, Teams)
3. API calls Azure OpenAI with a structured prompt + org context
4. Returns 3 vision tiers with Azure architectures, MVP plans, and consumption drivers

## Tech Stack

| Layer     | Technology                                   |
|-----------|----------------------------------------------|
| Frontend  | Next.js 15, React 19, Tailwind CSS, shadcn/ui |
| Backend   | Express, TypeScript, Zod, Pino               |
| AI        | Azure OpenAI (GPT-4o)                        |
| Org Data  | Microsoft Work IQ MCP (Model Context Protocol) |
| Build     | pnpm workspaces, Turborepo                   |

## Prerequisites

- **Node.js** ≥ 18.x
- **pnpm** ≥ 9.x
- **Azure OpenAI** resource with a chat model deployment
- **Microsoft 365** account (for WorkIQ, optional)

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

```bash
# API
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your Azure OpenAI credentials

# Web
cp apps/web/.env.example apps/web/.env
```

### 3. Accept WorkIQ EULA (Optional)

```bash
pnpm --filter @azure-vision-catalyst/api workiq:eula
```

On first run, WorkIQ will open a browser for Microsoft sign-in.

### 4. Start Development

```bash
pnpm dev
```

This starts both apps concurrently:
- **Web:** http://localhost:3000
- **API:** http://localhost:4000

### 5. Verify

```bash
curl http://localhost:4000/healthz
```

## Environment Variables

### API (`apps/api/.env`)

| Variable                    | Required | Description                          |
|-----------------------------|----------|--------------------------------------|
| `AZURE_OPENAI_ENDPOINT`    | Yes      | Azure OpenAI resource endpoint URL   |
| `AZURE_OPENAI_API_KEY`     | Yes      | API key for authentication           |
| `AZURE_OPENAI_DEPLOYMENT`  | Yes      | Chat model deployment name           |
| `AZURE_OPENAI_API_VERSION` | No       | API version (default: 2024-08-01-preview) |
| `PORT`                     | No       | API port (default: 4000)             |
| `WORKIQ_ENABLED`           | No       | Enable WorkIQ MCP (default: true)    |

### Web (`apps/web/.env`)

| Variable                  | Required | Description                      |
|---------------------------|----------|----------------------------------|
| `NEXT_PUBLIC_API_BASE_URL`| No       | API URL (default: http://localhost:4000) |

## API Endpoints

| Method | Path                   | Description                     |
|--------|------------------------|---------------------------------|
| GET    | `/healthz`             | Health check + status           |
| POST   | `/api/vision/generate` | Generate 3 Azure project visions|
| GET    | `/api/vision/:id`      | Retrieve a stored vision result |
| POST   | `/api/workiq/query`    | Query WorkIQ directly           |

## Project Structure

```
├── apps/
│   ├── api/                    # Express TypeScript backend
│   │   ├── src/
│   │   │   ├── index.ts        # Server entry point
│   │   │   ├── mcp/            # WorkIQ MCP client wrapper
│   │   │   ├── llm/            # Azure OpenAI wrapper + prompts
│   │   │   ├── routes/         # API route handlers
│   │   │   ├── schemas/        # Zod validation schemas
│   │   │   └── __tests__/      # Vitest tests
│   │   └── package.json
│   └── web/                    # Next.js frontend
│       ├── src/
│       │   ├── app/            # App Router pages
│       │   ├── components/     # React components
│       │   └── lib/            # API client + utilities
│       └── package.json
├── docs/                       # Documentation
├── turbo.json                  # Turborepo config
├── pnpm-workspace.yaml         # pnpm workspace config
└── package.json                # Root package.json
```

## Scripts

| Command        | Description                          |
|----------------|--------------------------------------|
| `pnpm dev`     | Start all apps in dev mode           |
| `pnpm build`   | Build all apps                       |
| `pnpm lint`    | Lint all apps                        |
| `pnpm test`    | Run all tests                        |
| `pnpm format`  | Format code with Prettier            |

## License

MIT — see [LICENSE](LICENSE)

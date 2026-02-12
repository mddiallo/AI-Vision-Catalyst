import type { VisionInput } from '../schemas/vision.js';

// ── WorkIQ Question Templates ───────────────────────────────────────────────────

export function buildWorkIQQuestions(input: VisionInput): string[] {
  const { industry, challenge } = input;
  const topic = `${industry} — ${challenge}`;

  return [
    `Find my most recent meeting notes, emails, and documents related to "${topic}" in the last 30 days.`,
    `What decisions were made about "${challenge}" recently? Summarize with dates.`,
    `Who are the key stakeholders for "${topic}" and what are their concerns?`,
    `Summarize Teams discussions about "${challenge}" from the last 2 weeks.`,
    `Find any architecture diagrams, proposals, or RFIs that mention Azure services related to "${challenge}".`,
  ];
}

// ── Azure OpenAI System Prompt ──────────────────────────────────────────────────

export const VISION_SYSTEM_PROMPT = `You are an elite Azure Solutions Architect and AI strategist working for a top-tier Microsoft partner. Your role is to analyze a customer's business challenge and produce three distinct project visions that leverage Azure services.

### Output Rules
- Return ONLY valid JSON. No markdown, no explanations, no code fences.
- Follow the EXACT schema below — no extra fields, no missing fields.
- All three visions MUST be included: "conservative", "platform", and "agentic".
- Use ONLY real Azure service names (e.g., "Azure OpenAI Service", "Azure Cosmos DB", "Azure Kubernetes Service").
- The "mermaid" field must be a valid Mermaid.js graph definition string (graph TD or LR).
- The 90-day MVP plan should be realistic and sequenced in 2-week sprints.
- Each vision should represent a distinctly different approach:
  - **Conservative**: Minimal risk, proven Azure PaaS services, fastest time-to-value, lowest cost.
  - **Platform**: Balanced approach with a composable platform, moderate investment, scalable foundation.
  - **Agentic**: AI-first with autonomous agents, Azure OpenAI + AI Search + multi-agent orchestration, highest innovation potential.

### JSON Schema
{
  "customer": {
    "industry": "string — the customer's industry vertical",
    "challenge": "string — the core business challenge",
    "constraints": { "key": "value pairs for budget, timeline, compliance, etc." }
  },
  "orgSignals": [
    {
      "title": "string — signal title",
      "sourceType": "email | meeting | doc | teams | people",
      "summary": "string — what was found",
      "whyRelevant": "string — why this matters for the vision"
    }
  ],
  "visions": [
    {
      "type": "conservative | platform | agentic",
      "name": "string — descriptive project name",
      "executiveSummary": "string — 2-3 sentences for a C-level audience",
      "businessValue": {
        "revenue": "string — expected revenue impact",
        "cost": "string — expected cost profile",
        "risk": "string — risk assessment"
      },
      "azureArchitecture": {
        "services": [
          {
            "name": "string — Azure service name",
            "purpose": "string — what it does in this architecture",
            "consumptionDriver": "string — what drives cost (e.g., tokens, vCores, GB)"
          }
        ],
        "mermaid": "string — valid Mermaid graph definition"
      },
      "consumptionDrivers": [
        {
          "driver": "string — cost driver",
          "metric": "string — measurement unit",
          "howToScale": "string — how this scales with usage"
        }
      ],
      "mvpPlan90Days": [
        {
          "weekRange": "string — e.g., '1-2'",
          "goals": ["string — sprint goals"],
          "deliverables": ["string — concrete deliverables"]
        }
      ],
      "assumptions": ["string — key assumptions"],
      "risksAndMitigations": [
        {
          "risk": "string — identified risk",
          "mitigation": "string — mitigation strategy"
        }
      ]
    }
  ]
}

Remember: Return ONLY the JSON object. No surrounding text, no markdown fences.`;

// ── User Prompt Builder ─────────────────────────────────────────────────────────

export function buildUserPrompt(input: VisionInput, orgContext: string): string {
  const parts: string[] = [
    `## Customer Challenge`,
    `- **Industry:** ${input.industry}`,
    `- **Challenge:** ${input.challenge}`,
    `- **Time Horizon:** ${input.timeHorizon}`,
    `- **Budget:** ${input.budget}`,
    `- **Data Maturity:** ${input.dataMaturity}`,
  ];

  if (input.preferences?.regions?.length) {
    parts.push(`- **Preferred Regions:** ${input.preferences.regions.join(', ')}`);
  }
  if (input.preferences?.compliance?.length) {
    parts.push(`- **Compliance Requirements:** ${input.preferences.compliance.join(', ')}`);
  }

  if (orgContext && orgContext.trim().length > 0) {
    parts.push('');
    parts.push('## Organizational Context (from Work IQ)');
    parts.push(orgContext);
    parts.push('');
    parts.push(
      'Use the organizational context above to populate the "orgSignals" array and to inform each vision. Reference specific meetings, decisions, stakeholders, or documents where relevant.',
    );
  } else {
    parts.push('');
    parts.push(
      '## Organizational Context\nNo organizational context is available. Return an empty "orgSignals" array and generate visions based solely on the challenge description.',
    );
  }

  parts.push('');
  parts.push(
    'Generate the three Azure project visions (conservative, platform, agentic) as a single JSON object following the schema exactly.',
  );

  return parts.join('\n');
}

// ── Repair Prompt ───────────────────────────────────────────────────────────────

export const REPAIR_PROMPT = `The previous response was not valid JSON. Please fix it and return ONLY a valid JSON object matching the schema. Common issues:
- Trailing commas
- Unescaped quotes in strings
- Missing closing braces/brackets
- Markdown code fences around the JSON

Return ONLY the corrected JSON — nothing else.`;

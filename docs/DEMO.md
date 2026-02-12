# Demo Script — Azure Vision Catalyst + WorkIQ

> Estimated time: 3–5 minutes

## Setup (Before Demo)

1. Ensure `apps/api/.env` has valid Azure OpenAI credentials
2. Run `pnpm install && pnpm dev`
3. Verify both apps are running: http://localhost:3000 and http://localhost:4000/healthz
4. (Optional) Run WorkIQ EULA acceptance and sign-in for live org context

---

## Demo Flow

### Scene 1 — Dashboard (30 seconds)

1. Open http://localhost:3000
2. **Talk through:**
   - "Azure Vision Catalyst turns any business challenge into three distinct Azure project visions"
   - "It enriches output with organizational context from Microsoft WorkIQ — pulling from emails, meetings, Teams chats, and documents"
   - "Let's generate a vision now"
3. Click **"Generate a Vision"**

### Scene 2 — Generate Form (60 seconds)

1. Fill in the form:
   - **Industry:** Healthcare
   - **Challenge:** "Our hospital network needs to automate patient intake and triage using AI, while maintaining strict HIPAA compliance and integrating with existing Epic EHR systems"
   - **Time Horizon:** 90 Days
   - **Budget:** Medium ($50K–$250K)
   - **Data Maturity:** Medium
   - **Compliance:** HIPAA, SOC2
   - **Regions:** East US
2. **Talk through:**
   - "We specify the industry, describe the challenge in plain language, and set guardrails — budget, timeline, data maturity, and compliance"
3. Click **"Generate Azure Project Visions"**

### Scene 3 — Progress (20 seconds)

1. Point out the progress stepper:
   - "The system is fetching organizational context from WorkIQ — pulling relevant meetings, decisions, and stakeholder info"
   - "Then it feeds everything into Azure OpenAI to generate three distinct visions"

### Scene 4 — Results Overview (60 seconds)

1. On the results page, start with the **Overview** tab
2. **Talk through:**
   - "Here's the customer summary and any organizational signals WorkIQ found"
   - "We get three vision cards: Conservative, Platform, and Agentic"
   - "Each represents a different investment level and innovation approach"

### Scene 5 — Vision Details (60 seconds)

1. Click the **Visions** tab
2. Expand each vision:
   - **Conservative:** "Low risk, proven Azure PaaS, fastest time to value"
   - **Platform:** "Composable platform with room to grow"
   - **Agentic:** "AI-first with autonomous agents — highest innovation"
3. Point out business value metrics and Azure service badges

### Scene 6 — Architecture & MVP (60 seconds)

1. Click **Architecture** tab — show Mermaid diagrams and service tables
2. Click **MVP Plan** tab — walk through the 90-day timeline
3. Click **Consumption** tab — show cost drivers and scaling characteristics

### Scene 7 — Export (15 seconds)

1. Click **Copy JSON** or **Download Markdown**
2. "Every result is exportable for further analysis, presentations, or integration into your toolchain"

---

## Key Talking Points

- **WorkIQ integration** grounds each vision in real organizational context
- **Three tiers** give customers options at every risk/investment level
- **Azure architecture** includes specific services, consumption drivers, and Mermaid diagrams
- **90-day MVP plans** are actionable and sequenced in 2-week sprints
- Works **with or without** WorkIQ — graceful degradation if not configured

## Troubleshooting

- If API is not responding: check `apps/api/.env` and re-run `pnpm dev`
- If WorkIQ shows "unavailable": see `docs/WORKIQ.md` for setup steps
- If vision generation fails: verify Azure OpenAI credentials and deployment name

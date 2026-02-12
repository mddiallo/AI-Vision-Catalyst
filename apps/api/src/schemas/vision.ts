import { z } from 'zod';

// ── Input Schema ────────────────────────────────────────────────────────────────

export const VisionInputSchema = z.object({
  industry: z.string().min(1, 'Industry is required'),
  challenge: z.string().min(10, 'Describe the challenge in at least 10 characters'),
  timeHorizon: z.enum(['30d', '90d', '6m', '12m']),
  budget: z.enum(['low', 'medium', 'high']),
  dataMaturity: z.enum(['low', 'medium', 'high']),
  preferences: z
    .object({
      regions: z.array(z.string()).optional(),
      compliance: z.array(z.string()).optional(),
    })
    .optional(),
});

export type VisionInput = z.infer<typeof VisionInputSchema>;

// ── WorkIQ Query Schema ─────────────────────────────────────────────────────────

export const WorkIQQuerySchema = z.object({
  question: z.string().min(1, 'Question is required'),
});

export type WorkIQQuery = z.infer<typeof WorkIQQuerySchema>;

// ── Output Schema ───────────────────────────────────────────────────────────────

export const AzureServiceSchema = z.object({
  name: z.string(),
  purpose: z.string(),
  consumptionDriver: z.string(),
});

export const AzureArchitectureSchema = z.object({
  services: z.array(AzureServiceSchema),
  mermaid: z.string(),
});

export const BusinessValueSchema = z.object({
  revenue: z.string(),
  cost: z.string(),
  risk: z.string(),
});

export const ConsumptionDriverSchema = z.object({
  driver: z.string(),
  metric: z.string(),
  howToScale: z.string(),
});

export const MVPWeekSchema = z.object({
  weekRange: z.string(),
  goals: z.array(z.string()),
  deliverables: z.array(z.string()),
});

export const RiskMitigationSchema = z.object({
  risk: z.string(),
  mitigation: z.string(),
});

export const VisionSchema = z.object({
  type: z.enum(['conservative', 'platform', 'agentic']),
  name: z.string(),
  executiveSummary: z.string(),
  businessValue: BusinessValueSchema,
  azureArchitecture: AzureArchitectureSchema,
  consumptionDrivers: z.array(ConsumptionDriverSchema),
  mvpPlan90Days: z.array(MVPWeekSchema),
  assumptions: z.array(z.string()),
  risksAndMitigations: z.array(RiskMitigationSchema),
});

export const OrgSignalSchema = z.object({
  title: z.string(),
  sourceType: z.enum(['email', 'meeting', 'doc', 'teams', 'people']),
  summary: z.string(),
  whyRelevant: z.string(),
});

export const CustomerSchema = z.object({
  industry: z.string(),
  challenge: z.string(),
  constraints: z.record(z.string()).optional(),
});

export const VisionOutputSchema = z.object({
  customer: CustomerSchema,
  orgSignals: z.array(OrgSignalSchema),
  visions: z.array(VisionSchema).length(3),
});

export type AzureService = z.infer<typeof AzureServiceSchema>;
export type AzureArchitecture = z.infer<typeof AzureArchitectureSchema>;
export type BusinessValue = z.infer<typeof BusinessValueSchema>;
export type ConsumptionDriver = z.infer<typeof ConsumptionDriverSchema>;
export type MVPWeek = z.infer<typeof MVPWeekSchema>;
export type RiskMitigation = z.infer<typeof RiskMitigationSchema>;
export type Vision = z.infer<typeof VisionSchema>;
export type OrgSignal = z.infer<typeof OrgSignalSchema>;
export type Customer = z.infer<typeof CustomerSchema>;
export type VisionOutput = z.infer<typeof VisionOutputSchema>;

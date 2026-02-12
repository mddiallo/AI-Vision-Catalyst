const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export interface HealthResponse {
  status: string;
  workiq: boolean;
  azure: boolean;
  timestamp: string;
}

export interface VisionInput {
  industry: string;
  challenge: string;
  timeHorizon: '30d' | '90d' | '6m' | '12m';
  budget: 'low' | 'medium' | 'high';
  dataMaturity: 'low' | 'medium' | 'high';
  preferences?: {
    regions?: string[];
    compliance?: string[];
  };
}

export interface OrgSignal {
  title: string;
  sourceType: 'email' | 'meeting' | 'doc' | 'teams' | 'people';
  summary: string;
  whyRelevant: string;
}

export interface AzureService {
  name: string;
  purpose: string;
  consumptionDriver: string;
}

export interface BusinessValue {
  revenue: string;
  cost: string;
  risk: string;
}

export interface ConsumptionDriver {
  driver: string;
  metric: string;
  howToScale: string;
}

export interface MVPWeek {
  weekRange: string;
  goals: string[];
  deliverables: string[];
}

export interface RiskMitigation {
  risk: string;
  mitigation: string;
}

export interface Vision {
  type: 'conservative' | 'platform' | 'agentic';
  name: string;
  executiveSummary: string;
  businessValue: BusinessValue;
  azureArchitecture: {
    services: AzureService[];
    mermaid: string;
  };
  consumptionDrivers: ConsumptionDriver[];
  mvpPlan90Days: MVPWeek[];
  assumptions: string[];
  risksAndMitigations: RiskMitigation[];
}

export interface VisionResult {
  id: string;
  customer: {
    industry: string;
    challenge: string;
    constraints?: Record<string, string>;
  };
  orgSignals: OrgSignal[];
  visions: Vision[];
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, body.message || body.error || 'Request failed');
  }

  return res.json();
}

export async function checkHealth(): Promise<HealthResponse> {
  return request<HealthResponse>('/healthz');
}

export async function generateVision(input: VisionInput): Promise<VisionResult> {
  return request<VisionResult>('/api/vision/generate', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function getVisionResult(id: string): Promise<VisionResult> {
  return request<VisionResult>(`/api/vision/${id}`);
}

export async function queryWorkIQ(question: string): Promise<{ answer: string; raw: any }> {
  return request<{ answer: string; raw: any }>('/api/workiq/query', {
    method: 'POST',
    body: JSON.stringify({ question }),
  });
}

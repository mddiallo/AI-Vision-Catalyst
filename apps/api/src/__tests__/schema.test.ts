import { describe, it, expect } from 'vitest';
import { VisionOutputSchema, VisionInputSchema } from '../schemas/vision.js';

describe('VisionInputSchema', () => {
  it('validates a correct input', () => {
    const input = {
      industry: 'Healthcare',
      challenge: 'Need to automate patient intake with AI while maintaining HIPAA compliance',
      timeHorizon: '90d',
      budget: 'medium',
      dataMaturity: 'medium',
      preferences: {
        regions: ['East US', 'West US'],
        compliance: ['HIPAA', 'SOC2'],
      },
    };

    const result = VisionInputSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('rejects missing industry', () => {
    const input = {
      industry: '',
      challenge: 'Some challenge here',
      timeHorizon: '90d',
      budget: 'medium',
      dataMaturity: 'low',
    };

    const result = VisionInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('rejects invalid time horizon', () => {
    const input = {
      industry: 'Finance',
      challenge: 'Modernize trading platform',
      timeHorizon: '2y',
      budget: 'high',
      dataMaturity: 'high',
    };

    const result = VisionInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('accepts input without preferences', () => {
    const input = {
      industry: 'Retail',
      challenge: 'Build a recommendation engine for e-commerce',
      timeHorizon: '6m',
      budget: 'low',
      dataMaturity: 'low',
    };

    const result = VisionInputSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
});

describe('VisionOutputSchema', () => {
  const validOutput = {
    customer: {
      industry: 'Healthcare',
      challenge: 'Automate patient intake',
      constraints: { budget: 'medium', timeline: '90 days' },
    },
    orgSignals: [
      {
        title: 'Q3 AI Initiative Meeting',
        sourceType: 'meeting',
        summary: 'Team discussed patient intake automation requirements',
        whyRelevant: 'Directly addresses the challenge scope and stakeholder alignment',
      },
    ],
    visions: [
      createVision('conservative', 'Smart Intake Lite'),
      createVision('platform', 'Healthcare Data Platform'),
      createVision('agentic', 'Autonomous Intake Agent'),
    ],
  };

  it('validates a correct output', () => {
    const result = VisionOutputSchema.safeParse(validOutput);
    expect(result.success).toBe(true);
  });

  it('rejects output with only 2 visions', () => {
    const invalid = {
      ...validOutput,
      visions: validOutput.visions.slice(0, 2),
    };

    const result = VisionOutputSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects invalid vision type', () => {
    const invalid = {
      ...validOutput,
      visions: [
        { ...validOutput.visions[0], type: 'experimental' },
        validOutput.visions[1],
        validOutput.visions[2],
      ],
    };

    const result = VisionOutputSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects invalid orgSignal source type', () => {
    const invalid = {
      ...validOutput,
      orgSignals: [
        {
          title: 'Test',
          sourceType: 'slack',
          summary: 'Test',
          whyRelevant: 'Test',
        },
      ],
    };

    const result = VisionOutputSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

function createVision(type: string, name: string) {
  return {
    type,
    name,
    executiveSummary: `Executive summary for ${name}`,
    businessValue: {
      revenue: 'Potential 20% efficiency gain',
      cost: '$50k-$150k over 12 months',
      risk: 'Low to moderate',
    },
    azureArchitecture: {
      services: [
        {
          name: 'Azure OpenAI Service',
          purpose: 'Natural language processing for intake forms',
          consumptionDriver: 'tokens',
        },
      ],
      mermaid: 'graph TD; A[User] --> B[App Service]; B --> C[Azure OpenAI]',
    },
    consumptionDrivers: [
      {
        driver: 'Token usage',
        metric: 'Tokens per minute',
        howToScale: 'Scales linearly with patient volume',
      },
    ],
    mvpPlan90Days: [
      {
        weekRange: '1-2',
        goals: ['Set up infrastructure'],
        deliverables: ['Azure resource provisioning'],
      },
    ],
    assumptions: ['Customer has Azure subscription'],
    risksAndMitigations: [
      {
        risk: 'Data privacy concerns',
        mitigation: 'Implement encryption at rest and in transit',
      },
    ],
  };
}

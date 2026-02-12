import { describe, it, expect } from 'vitest';
import { buildWorkIQQuestions } from '../llm/prompts.js';
import { VisionInputSchema, type VisionInput } from '../schemas/vision.js';

describe('buildWorkIQQuestions', () => {
  it('should generate questions based on input', () => {
    const input: VisionInput = {
      industry: 'Healthcare',
      challenge: 'Automate patient intake with AI',
      timeHorizon: '90d',
      budget: 'medium',
      dataMaturity: 'medium',
    };

    const questions = buildWorkIQQuestions(input);

    expect(questions).toHaveLength(5);
    expect(questions[0]).toContain('Healthcare');
    expect(questions[0]).toContain('Automate patient intake');
    expect(questions.every((q) => typeof q === 'string')).toBe(true);
    expect(questions.every((q) => q.length > 10)).toBe(true);
  });
});

describe('Vision Generation endpoint contract', () => {
  it('should have proper input schema requirements', () => {
    expect(VisionInputSchema.safeParse({}).success).toBe(false);
    expect(
      VisionInputSchema.safeParse({
        industry: 'Tech',
        challenge: 'Build something with AI for enterprise customers',
        timeHorizon: '90d',
        budget: 'high',
        dataMaturity: 'high',
      }).success,
    ).toBe(true);
  });
});

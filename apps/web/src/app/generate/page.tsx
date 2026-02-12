'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateVision, type VisionResult } from '@/lib/api';
import { GenerateForm } from '@/components/generate/GenerateForm';
import { ProgressStepper } from '@/components/generate/ProgressStepper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

const formSchema = z.object({
  industry: z.string().min(1, 'Industry is required'),
  challenge: z.string().min(10, 'Describe the challenge in at least 10 characters'),
  timeHorizon: z.enum(['30d', '90d', '6m', '12m']),
  budget: z.enum(['low', 'medium', 'high']),
  dataMaturity: z.enum(['low', 'medium', 'high']),
  compliance: z.string().optional(),
  regions: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

type GenerationStep = 'idle' | 'fetching-context' | 'analyzing' | 'generating' | 'done' | 'error';

export default function GeneratePage() {
  const router = useRouter();
  const [step, setStep] = useState<GenerationStep>('idle');
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: '',
      challenge: '',
      timeHorizon: '90d',
      budget: 'medium',
      dataMaturity: 'medium',
      compliance: '',
      regions: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setStep('fetching-context');
    setError(null);

    try {
      // Simulate progress steps
      await new Promise((r) => setTimeout(r, 800));
      setStep('analyzing');
      await new Promise((r) => setTimeout(r, 600));
      setStep('generating');

      const input = {
        industry: values.industry,
        challenge: values.challenge,
        timeHorizon: values.timeHorizon as '30d' | '90d' | '6m' | '12m',
        budget: values.budget as 'low' | 'medium' | 'high',
        dataMaturity: values.dataMaturity as 'low' | 'medium' | 'high',
        preferences: {
          compliance: values.compliance
            ? values.compliance.split(',').map((s) => s.trim()).filter(Boolean)
            : undefined,
          regions: values.regions
            ? values.regions.split(',').map((s) => s.trim()).filter(Boolean)
            : undefined,
        },
      };

      const result: VisionResult = await generateVision(input);
      setStep('done');

      // Store result in localStorage for the results page
      localStorage.setItem(`vision-${result.id}`, JSON.stringify(result));

      // Short delay to show completion, then navigate
      await new Promise((r) => setTimeout(r, 500));
      router.push(`/results/${result.id}`);
    } catch (err: any) {
      setStep('error');
      setError(err.message || 'Failed to generate visions');
    }
  }

  const isGenerating = step !== 'idle' && step !== 'error';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Generate Azure Project Visions</h1>
        <p className="text-muted-foreground mt-1">
          Describe a business challenge to get three Azure project visions enriched
          with your organizational context.
        </p>
      </div>

      {/* WorkIQ Status Warning */}
      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>
          WorkIQ integration is available when the API backend has WorkIQ MCP configured.
          Without it, visions will be generated without organizational context.
        </span>
      </div>

      {/* Progress Overlay */}
      {isGenerating && (
        <ProgressStepper currentStep={step} />
      )}

      {/* Error */}
      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive text-lg">Generation Failed</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => { setStep('idle'); setError(null); }}
              className="text-sm text-primary hover:underline"
            >
              Try again
            </button>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      {!isGenerating && (
        <GenerateForm form={form} onSubmit={onSubmit} disabled={isGenerating} />
      )}
    </div>
  );
}

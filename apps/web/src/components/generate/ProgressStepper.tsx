'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressStepperProps {
  currentStep: string;
}

const steps = [
  { id: 'fetching-context', label: 'Fetching organizational context from WorkIQ' },
  { id: 'analyzing', label: 'Analyzing signals and building prompts' },
  { id: 'generating', label: 'Generating Azure project visions' },
  { id: 'done', label: 'Complete' },
];

export function ProgressStepper({ currentStep }: ProgressStepperProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="py-6">
        <div className="space-y-4">
          {steps.map((step, i) => {
            const isComplete = i < currentIndex;
            const isCurrent = i === currentIndex;
            const isPending = i > currentIndex;

            return (
              <div key={step.id} className="flex items-center gap-3">
                {isComplete ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/40 shrink-0" />
                )}
                <span
                  className={cn(
                    'text-sm',
                    isComplete && 'text-emerald-700',
                    isCurrent && 'text-foreground font-medium',
                    isPending && 'text-muted-foreground',
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

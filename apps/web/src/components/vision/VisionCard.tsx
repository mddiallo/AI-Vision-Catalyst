'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Vision } from '@/lib/api';

interface VisionCardProps {
  vision: Vision;
}

const typeConfig: Record<string, { color: string; badgeVariant: string; label: string }> = {
  conservative: { color: 'bg-emerald-500', badgeVariant: 'success', label: 'Conservative' },
  platform: { color: 'bg-blue-500', badgeVariant: 'info', label: 'Platform' },
  agentic: { color: 'bg-amber-500', badgeVariant: 'warning', label: 'Agentic' },
};

export function VisionCard({ vision }: VisionCardProps) {
  const config = typeConfig[vision.type] ?? typeConfig.conservative!;

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 ${config.color}`} />

      <CardHeader>
        <div className="flex items-center gap-3">
          <Badge variant={config.badgeVariant as any}>{config.label}</Badge>
          <CardTitle className="text-xl">{vision.name}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Executive Summary */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Executive Summary</p>
          <p className="text-sm">{vision.executiveSummary}</p>
        </div>

        <Separator />

        {/* Business Value */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-3">Business Value</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs font-medium text-muted-foreground">Revenue Impact</p>
              <p className="text-sm mt-1">{vision.businessValue.revenue}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs font-medium text-muted-foreground">Cost Profile</p>
              <p className="text-sm mt-1">{vision.businessValue.cost}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs font-medium text-muted-foreground">Risk Level</p>
              <p className="text-sm mt-1">{vision.businessValue.risk}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Azure Services */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Azure Services ({vision.azureArchitecture.services.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {vision.azureArchitecture.services.map((svc, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {svc.name}
                <span className="ml-1 text-muted-foreground">({svc.consumptionDriver})</span>
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Assumptions */}
        {vision.assumptions.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Key Assumptions</p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              {vision.assumptions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

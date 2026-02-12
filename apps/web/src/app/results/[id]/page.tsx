'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { type VisionResult, getVisionResult } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { VisionCard } from '@/components/vision/VisionCard';
import { OrgSignalCard } from '@/components/vision/OrgSignalCard';
import { MermaidDiagram } from '@/components/vision/MermaidDiagram';
import { ExportButtons } from '@/components/vision/ExportButtons';
import { EmptyState } from '@/components/common/EmptyState';
import { FileText, Eye, Layers, Calendar, BarChart3 } from 'lucide-react';

export default function ResultsPage() {
  const params = useParams();
  const id = params.id as string;
  const [result, setResult] = useState<VisionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      // Try localStorage first
      const cached = localStorage.getItem(`vision-${id}`);
      if (cached) {
        try {
          setResult(JSON.parse(cached));
          setLoading(false);
          return;
        } catch {
          // fall through to API
        }
      }

      // Fetch from API
      try {
        const data = await getVisionResult(id);
        setResult(data);
        localStorage.setItem(`vision-${id}`, JSON.stringify(data));
      } catch (err: any) {
        setError(err.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-96" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <EmptyState
        icon={FileText}
        title="Result Not Found"
        description={error || 'This vision result could not be loaded.'}
      />
    );
  }

  const visionTypeColors: Record<string, string> = {
    conservative: 'success',
    platform: 'info',
    agentic: 'warning',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Vision Results</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {result.customer.industry} — {result.customer.challenge}
          </p>
        </div>
        <ExportButtons result={result} />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            <Eye className="h-4 w-4 mr-1.5 hidden sm:inline" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="visions" className="text-xs sm:text-sm">
            <Layers className="h-4 w-4 mr-1.5 hidden sm:inline" />
            Visions
          </TabsTrigger>
          <TabsTrigger value="architecture" className="text-xs sm:text-sm">
            <FileText className="h-4 w-4 mr-1.5 hidden sm:inline" />
            Architecture
          </TabsTrigger>
          <TabsTrigger value="mvp" className="text-xs sm:text-sm">
            <Calendar className="h-4 w-4 mr-1.5 hidden sm:inline" />
            MVP Plan
          </TabsTrigger>
          <TabsTrigger value="consumption" className="text-xs sm:text-sm">
            <BarChart3 className="h-4 w-4 mr-1.5 hidden sm:inline" />
            Consumption
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Customer Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Industry</p>
                  <p className="text-sm">{result.customer.industry}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Challenge</p>
                  <p className="text-sm">{result.customer.challenge}</p>
                </div>
              </div>
              {result.customer.constraints && Object.keys(result.customer.constraints).length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Constraints</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(result.customer.constraints).map(([key, val]) => (
                        <Badge key={key} variant="outline">
                          {key}: {val}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Org Signals */}
          <Card>
            <CardHeader>
              <CardTitle>Organizational Signals</CardTitle>
              <CardDescription>
                Context gathered from Work IQ ({result.orgSignals.length} signals)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.orgSignals.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No organizational signals available. WorkIQ was not connected during generation.
                </p>
              ) : (
                <div className="space-y-3">
                  {result.orgSignals.map((signal, i) => (
                    <OrgSignalCard key={i} signal={signal} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Visions Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            {result.visions.map((vision) => (
              <Card key={vision.type} className="relative overflow-hidden">
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    vision.type === 'conservative'
                      ? 'bg-emerald-500'
                      : vision.type === 'platform'
                        ? 'bg-blue-500'
                        : 'bg-amber-500'
                  }`}
                />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        (visionTypeColors[vision.type] as any) || 'default'
                      }
                    >
                      {vision.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {vision.azureArchitecture.services.length} services
                    </span>
                  </div>
                  <CardTitle className="text-base mt-2">{vision.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {vision.executiveSummary}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Visions Tab */}
        <TabsContent value="visions" className="space-y-6">
          {result.visions.map((vision) => (
            <VisionCard key={vision.type} vision={vision} />
          ))}
        </TabsContent>

        {/* Architecture Tab */}
        <TabsContent value="architecture" className="space-y-6">
          {result.visions.map((vision) => (
            <Card key={vision.type}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      (visionTypeColors[vision.type] as any) || 'default'
                    }
                  >
                    {vision.type}
                  </Badge>
                  <CardTitle className="text-lg">{vision.name} — Architecture</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Service List */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4 font-medium">Azure Service</th>
                        <th className="text-left py-2 pr-4 font-medium">Purpose</th>
                        <th className="text-left py-2 font-medium">Cost Driver</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vision.azureArchitecture.services.map((svc, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-2 pr-4 font-medium">{svc.name}</td>
                          <td className="py-2 pr-4 text-muted-foreground">{svc.purpose}</td>
                          <td className="py-2">
                            <Badge variant="outline" className="text-xs">
                              {svc.consumptionDriver}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Separator />

                {/* Mermaid Diagram */}
                <div>
                  <p className="text-sm font-medium mb-3">Architecture Diagram</p>
                  <MermaidDiagram chart={vision.azureArchitecture.mermaid} />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* MVP Plan Tab */}
        <TabsContent value="mvp" className="space-y-6">
          {result.visions.map((vision) => (
            <Card key={vision.type}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      (visionTypeColors[vision.type] as any) || 'default'
                    }
                  >
                    {vision.type}
                  </Badge>
                  <CardTitle className="text-lg">{vision.name} — 90-Day MVP</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vision.mvpPlan90Days.map((week, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary text-xs font-bold">
                          W{week.weekRange}
                        </div>
                        {i < vision.mvpPlan90Days.length - 1 && (
                          <div className="w-px flex-1 bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium">Weeks {week.weekRange}</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Goals
                          </p>
                          <ul className="text-sm text-muted-foreground list-disc list-inside">
                            {week.goals.map((g, gi) => (
                              <li key={gi}>{g}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Deliverables
                          </p>
                          <ul className="text-sm text-muted-foreground list-disc list-inside">
                            {week.deliverables.map((d, di) => (
                              <li key={di}>{d}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Consumption Tab */}
        <TabsContent value="consumption" className="space-y-6">
          {result.visions.map((vision) => (
            <Card key={vision.type}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      (visionTypeColors[vision.type] as any) || 'default'
                    }
                  >
                    {vision.type}
                  </Badge>
                  <CardTitle className="text-lg">{vision.name} — Consumption Drivers</CardTitle>
                </div>
                <CardDescription>
                  Business value: Revenue — {vision.businessValue.revenue} | Cost — {vision.businessValue.cost} | Risk — {vision.businessValue.risk}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {vision.consumptionDrivers.map((cd, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg border bg-muted/30 space-y-2"
                    >
                      <p className="text-sm font-medium">{cd.driver}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {cd.metric}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {cd.howToScale}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Risks & Mitigations */}
                {vision.risksAndMitigations.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <p className="text-sm font-medium mb-3">Risks & Mitigations</p>
                      <div className="space-y-2">
                        {vision.risksAndMitigations.map((rm, i) => (
                          <div key={i} className="flex gap-3 text-sm">
                            <Badge variant="destructive" className="shrink-0 text-xs">
                              Risk
                            </Badge>
                            <div>
                              <p>{rm.risk}</p>
                              <p className="text-muted-foreground mt-0.5">
                                <strong>Mitigation:</strong> {rm.mitigation}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

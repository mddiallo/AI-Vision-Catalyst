'use client';

import { Button } from '@/components/ui/button';
import { Copy, Download } from 'lucide-react';
import type { VisionResult } from '@/lib/api';

interface ExportButtonsProps {
  result: VisionResult;
}

export function ExportButtons({ result }: ExportButtonsProps) {
  function copyJSON() {
    const json = JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(json);
  }

  function downloadMarkdown() {
    const md = generateMarkdown(result);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vision-${result.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={copyJSON}>
        <Copy className="h-4 w-4 mr-1.5" />
        Copy JSON
      </Button>
      <Button variant="outline" size="sm" onClick={downloadMarkdown}>
        <Download className="h-4 w-4 mr-1.5" />
        Download MD
      </Button>
    </div>
  );
}

function generateMarkdown(result: VisionResult): string {
  const lines: string[] = [];

  lines.push(`# Azure Vision Catalyst — Results`);
  lines.push('');
  lines.push(`## Customer`);
  lines.push(`- **Industry:** ${result.customer.industry}`);
  lines.push(`- **Challenge:** ${result.customer.challenge}`);
  lines.push('');

  if (result.orgSignals.length > 0) {
    lines.push(`## Organizational Signals`);
    result.orgSignals.forEach((s) => {
      lines.push(`### ${s.title} (${s.sourceType})`);
      lines.push(s.summary);
      lines.push(`> _${s.whyRelevant}_`);
      lines.push('');
    });
  }

  result.visions.forEach((v) => {
    lines.push(`## ${v.name} (${v.type})`);
    lines.push('');
    lines.push(`### Executive Summary`);
    lines.push(v.executiveSummary);
    lines.push('');

    lines.push(`### Business Value`);
    lines.push(`| Metric | Assessment |`);
    lines.push(`|--------|-----------|`);
    lines.push(`| Revenue | ${v.businessValue.revenue} |`);
    lines.push(`| Cost | ${v.businessValue.cost} |`);
    lines.push(`| Risk | ${v.businessValue.risk} |`);
    lines.push('');

    lines.push(`### Azure Architecture`);
    lines.push('');
    lines.push(`| Service | Purpose | Cost Driver |`);
    lines.push(`|---------|---------|------------|`);
    v.azureArchitecture.services.forEach((svc) => {
      lines.push(`| ${svc.name} | ${svc.purpose} | ${svc.consumptionDriver} |`);
    });
    lines.push('');

    lines.push('```mermaid');
    lines.push(v.azureArchitecture.mermaid);
    lines.push('```');
    lines.push('');

    lines.push(`### 90-Day MVP Plan`);
    v.mvpPlan90Days.forEach((week) => {
      lines.push(`#### Weeks ${week.weekRange}`);
      lines.push(`**Goals:** ${week.goals.join(', ')}`);
      lines.push(`**Deliverables:** ${week.deliverables.join(', ')}`);
      lines.push('');
    });

    lines.push(`### Consumption Drivers`);
    v.consumptionDrivers.forEach((cd) => {
      lines.push(`- **${cd.driver}** (${cd.metric}): ${cd.howToScale}`);
    });
    lines.push('');

    if (v.assumptions.length > 0) {
      lines.push(`### Assumptions`);
      v.assumptions.forEach((a) => lines.push(`- ${a}`));
      lines.push('');
    }

    if (v.risksAndMitigations.length > 0) {
      lines.push(`### Risks & Mitigations`);
      v.risksAndMitigations.forEach((rm) => {
        lines.push(`- **Risk:** ${rm.risk}`);
        lines.push(`  **Mitigation:** ${rm.mitigation}`);
      });
      lines.push('');
    }
  });

  return lines.join('\n');
}

import { Badge } from '@/components/ui/badge';
import type { OrgSignal } from '@/lib/api';
import { Mail, Users, FileText, MessageSquare, UserCircle } from 'lucide-react';

interface OrgSignalCardProps {
  signal: OrgSignal;
}

const sourceIcons: Record<string, any> = {
  email: Mail,
  meeting: Users,
  doc: FileText,
  teams: MessageSquare,
  people: UserCircle,
};

const sourceColors: Record<string, string> = {
  email: 'info',
  meeting: 'success',
  doc: 'secondary',
  teams: 'warning',
  people: 'default',
};

export function OrgSignalCard({ signal }: OrgSignalCardProps) {
  const Icon = sourceIcons[signal.sourceType] || FileText;
  const color = sourceColors[signal.sourceType] || 'default';

  return (
    <div className="flex gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
      <div className="shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="space-y-1 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">{signal.title}</p>
          <Badge variant={color as any} className="text-xs shrink-0">
            {signal.sourceType}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{signal.summary}</p>
        <p className="text-xs text-muted-foreground italic">{signal.whyRelevant}</p>
      </div>
    </div>
  );
}

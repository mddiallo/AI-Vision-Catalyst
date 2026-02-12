import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

interface StatusBadgeProps {
  available: boolean;
  label?: string;
}

export function StatusBadge({ available, label }: StatusBadgeProps) {
  if (available) {
    return (
      <Badge variant="success" className="text-xs">
        <Wifi className="h-3 w-3 mr-1" />
        {label || 'Connected'}
      </Badge>
    );
  }

  return (
    <Badge variant="warning" className="text-xs">
      <WifiOff className="h-3 w-3 mr-1" />
      {label || 'Unavailable'}
    </Badge>
  );
}

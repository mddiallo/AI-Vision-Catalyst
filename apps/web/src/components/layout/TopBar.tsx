'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const mobileNavItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/generate', label: 'Generate' },
  { href: '/settings', label: 'Settings' },
];

export function TopBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Derive page title from pathname
  const pageTitle =
    pathname === '/'
      ? 'Dashboard'
      : pathname.startsWith('/generate')
        ? 'Generate Vision'
        : pathname.startsWith('/results')
          ? 'Vision Results'
          : pathname.startsWith('/settings')
            ? 'Settings'
            : 'Azure Vision Catalyst';

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-14 items-center px-4 md:px-6">
        {/* Mobile menu */}
        <div className="md:hidden flex items-center mr-3">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Cpu className="h-6 w-6 text-primary ml-2" />
        </div>

        <h2 className="text-lg font-semibold">{pageTitle}</h2>

        <div className="ml-auto flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1 text-xs text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>API Connected</span>
          </div>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <nav className="md:hidden border-t px-4 py-2 space-y-1 bg-white">
          {mobileNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'block px-3 py-2 text-sm rounded-md',
                pathname === item.href
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

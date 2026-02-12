import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Server, Shield, Key, ExternalLink } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings & Configuration</h1>
        <p className="text-muted-foreground mt-1">
          Environment variables and integration setup
        </p>
      </div>

      {/* Azure OpenAI */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Server className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Azure OpenAI</CardTitle>
              <CardDescription>Required for vision generation</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Set these environment variables in <code className="bg-muted px-1.5 py-0.5 rounded text-xs">apps/api/.env</code>:
          </p>
          <div className="space-y-2">
            {[
              { name: 'AZURE_OPENAI_ENDPOINT', desc: 'Your Azure OpenAI resource endpoint URL' },
              { name: 'AZURE_OPENAI_API_KEY', desc: 'API key for authentication' },
              { name: 'AZURE_OPENAI_DEPLOYMENT', desc: 'Chat model deployment name (e.g., gpt-4o)' },
              { name: 'AZURE_OPENAI_API_VERSION', desc: 'API version (default: 2024-08-01-preview)' },
            ].map((env) => (
              <div key={env.name} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <code className="text-xs font-mono bg-background px-2 py-1 rounded border shrink-0">
                  {env.name}
                </code>
                <span className="text-sm text-muted-foreground">{env.desc}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* WorkIQ MCP */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Shield className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Work IQ MCP Server</CardTitle>
              <CardDescription>Optional — enriches visions with org context</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            WorkIQ connects to your Microsoft 365 tenant to pull meeting notes,
            emails, Teams chats, and documents relevant to each vision.
          </p>

          <Separator />

          <div>
            <p className="text-sm font-medium mb-2">Setup Steps</p>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <Badge variant="outline" className="shrink-0 text-xs">1</Badge>
                <span>
                  Accept the EULA:{' '}
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                    pnpm --filter api workiq:eula
                  </code>
                </span>
              </li>
              <li className="flex gap-2">
                <Badge variant="outline" className="shrink-0 text-xs">2</Badge>
                <span>
                  Start the MCP server (done automatically when API starts).
                  On first run, complete browser-based Microsoft sign-in.
                </span>
              </li>
              <li className="flex gap-2">
                <Badge variant="outline" className="shrink-0 text-xs">3</Badge>
                <span>
                  Set <code className="bg-muted px-1.5 py-0.5 rounded text-xs">WORKIQ_ENABLED=true</code> in
                  the API .env file.
                </span>
              </li>
            </ol>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium mb-2">Troubleshooting</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>EULA not accepted:</strong> Run{' '}
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs">npx -y @microsoft/workiq accept-eula</code>
              </p>
              <p>
                <strong>Auth required:</strong> WorkIQ needs interactive browser
                sign-in on first use. This cannot run in Docker without prior auth.
              </p>
              <p>
                <strong>Tenant admin consent:</strong> Some organizations require admin
                approval for WorkIQ. Contact your IT administrator.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Connection */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Key className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg">API Connection</CardTitle>
              <CardDescription>Frontend-to-backend connectivity</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <code className="text-xs font-mono bg-background px-2 py-1 rounded border shrink-0">
              NEXT_PUBLIC_API_BASE_URL
            </code>
            <span className="text-sm text-muted-foreground">
              API base URL (default: http://localhost:4000). Set in{' '}
              <code className="bg-muted px-1 rounded text-xs">apps/web/.env</code>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

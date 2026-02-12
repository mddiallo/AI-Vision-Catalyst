import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Brain, Target, BarChart3, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 md:p-12 text-white">
        <div className="relative z-10">
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
            Powered by Azure OpenAI + WorkIQ
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Azure Vision Catalyst
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mb-6">
            Transform any business challenge into three actionable Azure project visions —
            Conservative, Platform, and Agentic — enriched with real organizational context
            from Microsoft Work IQ.
          </p>
          <Link href="/generate">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              <Sparkles className="mr-2 h-5 w-5" />
              Generate a Vision
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-white/5 rounded-full -mb-48" />
      </section>

      {/* Feature Cards */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Brain className="h-5 w-5 text-emerald-600" />
              </div>
              <CardTitle className="text-lg">WorkIQ Integration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm">
              Automatically pulls context from your meetings, emails, Teams chats,
              and documents to ground each vision in real organizational knowledge.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Three Vision Tiers</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm">
              Every challenge generates Conservative, Platform, and Agentic visions
              with detailed Azure architectures, cost drivers, and 90-day MVP plans.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Consumption Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm">
              Understand Azure consumption drivers, cost profiles, and scaling
              characteristics for each vision to optimize investment decisions.
            </CardDescription>
          </CardContent>
        </Card>
      </section>

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>Get your first vision in under 2 minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                1
              </span>
              <span>
                Navigate to the <strong>Generate</strong> page and describe your
                customer&apos;s business challenge.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                2
              </span>
              <span>
                Select the industry, budget, timeline, and data maturity level.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                3
              </span>
              <span>
                Click <strong>Generate Visions</strong> — the system will fetch
                organizational context from WorkIQ and produce three Azure project
                visions.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                4
              </span>
              <span>
                Review the results: architecture diagrams, MVP plans, consumption
                drivers, and export as JSON or Markdown.
              </span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

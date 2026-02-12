'use client';

import { UseFormReturn } from 'react-hook-form';
import type { FormValues } from '@/app/generate/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sparkles } from 'lucide-react';

interface GenerateFormProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => void;
  disabled: boolean;
}

export function GenerateForm({ form, onSubmit, disabled }: GenerateFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Industry */}
          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <Select
              onValueChange={(val) => setValue('industry', val)}
              value={watch('industry')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {[
                  'Healthcare',
                  'Financial Services',
                  'Retail & E-commerce',
                  'Manufacturing',
                  'Energy & Utilities',
                  'Public Sector',
                  'Education',
                  'Media & Entertainment',
                  'Transportation & Logistics',
                  'Technology',
                ].map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.industry && (
              <p className="text-xs text-destructive">{errors.industry.message}</p>
            )}
          </div>

          {/* Challenge */}
          <div className="space-y-2">
            <Label htmlFor="challenge">Business Challenge *</Label>
            <Textarea
              id="challenge"
              placeholder="Describe the customer's core business challenge in detail. Include pain points, current state, desired outcomes..."
              rows={4}
              {...register('challenge')}
            />
            {errors.challenge && (
              <p className="text-xs text-destructive">{errors.challenge.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Time Horizon */}
            <div className="space-y-2">
              <Label>Time Horizon</Label>
              <Select
                onValueChange={(val) => setValue('timeHorizon', val as any)}
                value={watch('timeHorizon')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="12m">12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <Label>Budget Level</Label>
              <Select
                onValueChange={(val) => setValue('budget', val as any)}
                value={watch('budget')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (&lt; $50K)</SelectItem>
                  <SelectItem value="medium">Medium ($50K–$250K)</SelectItem>
                  <SelectItem value="high">High ($250K+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data Maturity */}
            <div className="space-y-2">
              <Label>Data Maturity</Label>
              <Select
                onValueChange={(val) => setValue('dataMaturity', val as any)}
                value={watch('dataMaturity')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low — Limited data strategy</SelectItem>
                  <SelectItem value="medium">Medium — Some data pipelines</SelectItem>
                  <SelectItem value="high">High — Modern data platform</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Compliance */}
          <div className="space-y-2">
            <Label htmlFor="compliance">Compliance Requirements</Label>
            <Input
              id="compliance"
              placeholder="e.g., HIPAA, SOC2, GDPR (comma-separated)"
              {...register('compliance')}
            />
          </div>

          {/* Regions */}
          <div className="space-y-2">
            <Label htmlFor="regions">Preferred Azure Regions</Label>
            <Input
              id="regions"
              placeholder="e.g., East US, West Europe (comma-separated)"
              {...register('regions')}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" disabled={disabled} className="w-full">
        <Sparkles className="mr-2 h-5 w-5" />
        Generate Azure Project Visions
      </Button>
    </form>
  );
}

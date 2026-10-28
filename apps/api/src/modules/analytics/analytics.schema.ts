import { z } from 'zod';

export const analyticsQuerySchema = z.object({
  period: z.enum(['day', 'week', 'month', 'year']).optional().default('week'),
});

export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;
import { z } from 'zod';

export const reportQuerySchema = z.object({
  type: z.enum(['sales', 'inventory', 'financial', 'insurance']).optional().default('sales'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type ReportQueryInput = z.infer<typeof reportQuerySchema>;
import { pgTable, serial, integer, varchar, timestamp, numeric, text } from 'drizzle-orm/pg-core';

export const cashierShifts = pgTable('cashier_shifts', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').notNull(), // Tenant isolation
  branchId: integer('branch_id').notNull(),
  userId: integer('user_id').notNull(),
  userName: varchar('user_name', { length: 255 }).notNull(),
  status: varchar('status', { length: 20 }).default('active').notNull(),
  startTime: timestamp('start_time').defaultNow().notNull(),
  endTime: timestamp('end_time'),
  
  // Financial Reconciliation Fields
  openingCash: numeric('opening_cash', { precision: 12, scale: 2 }).notNull(),
  expectedCash: numeric('expected_cash', { precision: 12, scale: 2 }), // Opening + Sales - Refunds
  actualCash: numeric('actual_cash', { precision: 12, scale: 2 }), // Physical count
  variance: numeric('variance', { precision: 12, scale: 2 }), // Actual - Expected
  reconciliationNotes: text('reconciliation_notes'),
  
  managerApprovalId: integer('manager_approval_id'),
});
import { pgTable, serial, integer, varchar, timestamp, decimal } from 'drizzle-orm/pg-core';
import { tenants } from '../tenants/tenants.schema';
import { sales } from '../pos/pos.schema';

export const paymentTransactions = pgTable('payment_transactions', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  saleId: integer('sale_id').references(() => sales.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
  referenceNumber: varchar('reference_number', { length: 255 }),
  status: varchar('status', { length: 50 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});
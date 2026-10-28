import { pgTable, serial, varchar, timestamp, integer } from 'drizzle-orm/pg-core';
import { tenants } from '../tenants/tenants.schema';

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  customerType: varchar('customer_type', { length: 50 }).default('retail'),
  createdAt: timestamp('created_at').defaultNow(),
});
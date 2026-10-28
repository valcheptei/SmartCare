import { pgTable, serial, integer, varchar, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { tenants } from '../tenants/tenants.schema';

export const complianceEvents = pgTable('compliance_events', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  eventType: varchar('event_type', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow(),
});
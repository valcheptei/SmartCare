import { pgTable, serial, integer, varchar, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { tenants } from '../tenants/tenants.schema';

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  userId: integer('user_id').notNull(),
  action: varchar('action', { length: 255 }).notNull(),
  recordType: varchar('record_type', { length: 255 }).notNull(),
  recordId: integer('record_id'),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow(),
});
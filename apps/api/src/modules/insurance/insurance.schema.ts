import { pgTable, serial, varchar, timestamp, integer, decimal } from 'drizzle-orm/pg-core';
import { tenants } from '../tenants/tenants.schema';
import { patients } from '../prescriptions/prescriptions.schema';
import { sales } from '../pos/pos.schema';

export const insuranceProviders = pgTable('insurance_providers', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  providerName: varchar('provider_name', { length: 255 }).notNull(),
  contactPhone: varchar('contact_phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const insuranceClaims = pgTable('insurance_claims', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  providerId: integer('provider_id').references(() => insuranceProviders.id).notNull(),
  patientId: integer('patient_id').references(() => patients.id).notNull(),
  saleId: integer('sale_id').references(() => sales.id),
  policyNumber: varchar('policy_number', { length: 100 }).notNull(),
  claimAmount: decimal('claim_amount', { precision: 12, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});
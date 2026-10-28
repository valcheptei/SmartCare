import { pgTable, serial, varchar, timestamp, integer, text } from 'drizzle-orm/pg-core';
import { tenants } from '../tenants/tenants.schema';
import { medicines } from '../medicines/medicines.schema';

export const patients = pgTable('patients', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  patientIdentifier: varchar('patient_identifier', { length: 100 }),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  contactNumber: varchar('contact_number', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const prescriptions = pgTable('prescriptions', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  patientId: integer('patient_id').references(() => patients.id).notNull(),
  prescriberName: varchar('prescriber_name', { length: 255 }),
  facility: varchar('facility', { length: 255 }),
  status: varchar('status', { length: 50 }).default('pending_verification'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const prescriptionItems = pgTable('prescription_items', {
  id: serial('id').primaryKey(),
  prescriptionId: integer('prescription_id').references(() => prescriptions.id).notNull(),
  medicineId: integer('medicine_id').references(() => medicines.id).notNull(),
  prescribedQuantity: integer('prescribed_quantity').notNull(),
  directions: text('directions'),
});
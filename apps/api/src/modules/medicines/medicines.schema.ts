import { pgTable, serial, varchar, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { tenants } from '../tenants/tenants.schema';

export const medicines = pgTable('medicines', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  medicineName: varchar('medicine_name', { length: 255 }).notNull(),
  brandName: varchar('brand_name', { length: 255 }),
  genericName: varchar('generic_name', { length: 255 }),
  sku: varchar('sku', { length: 100 }),
  barcode: varchar('barcode', { length: 100 }),
  category: varchar('category', { length: 100 }),
  dosageForm: varchar('dosage_form', { length: 100 }),
  strength: varchar('strength', { length: 100 }),
  packSize: integer('pack_size'),
  unitOfMeasure: varchar('unit_of_measure', { length: 50 }),
  manufacturer: varchar('manufacturer', { length: 255 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
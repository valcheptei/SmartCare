import { pgTable, serial, varchar, timestamp, integer, decimal } from 'drizzle-orm/pg-core';
import { tenants } from '../tenants/tenants.schema';
import { medicines } from '../medicines/medicines.schema';

export const medicineBatches = pgTable('medicine_batches', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  medicineId: integer('medicine_id').references(() => medicines.id).notNull(),
  batchNumber: varchar('batch_number', { length: 255 }).notNull(),
  expiryDate: timestamp('expiry_date').notNull(),
  quantityReceived: integer('quantity_received').notNull(),
  currentQuantity: integer('current_quantity').notNull(),
  purchaseCost: decimal('purchase_cost', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
});
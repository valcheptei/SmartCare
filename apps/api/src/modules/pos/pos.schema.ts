import { pgTable, serial, varchar, timestamp, integer, decimal } from 'drizzle-orm/pg-core';
import { tenants } from '../tenants/tenants.schema';
import { medicines } from '../medicines/medicines.schema';
import { medicineBatches } from '../inventory/inventory.schema';

export const sales = pgTable('sales', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  receiptNumber: varchar('receipt_number', { length: 100 }).notNull(),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }),
  status: varchar('status', { length: 50 }).default('completed'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const saleItems = pgTable('sale_items', {
  id: serial('id').primaryKey(),
  saleId: integer('sale_id').references(() => sales.id).notNull(),
  medicineId: integer('medicine_id').references(() => medicines.id).notNull(),
  batchId: integer('batch_id').references(() => medicineBatches.id).notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
});
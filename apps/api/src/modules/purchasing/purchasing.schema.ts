import { pgTable, serial, varchar, timestamp, integer } from 'drizzle-orm/pg-core';
import { tenants } from '../tenants/tenants.schema';

export const suppliers = pgTable('suppliers', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  contactPerson: varchar('contact_person', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const purchaseOrders = pgTable('purchase_orders', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  supplierId: integer('supplier_id').references(() => suppliers.id).notNull(),
  status: varchar('status', { length: 50 }).default('pending'),
  expectedDeliveryDate: timestamp('expected_delivery_date'),
  createdAt: timestamp('created_at').defaultNow(),
});
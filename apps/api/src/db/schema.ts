import { pgTable, serial, varchar, timestamp, boolean, integer, decimal, text, date, jsonb, pgEnum } from 'drizzle-orm/pg-core';
export const movementTypeEnum = pgEnum('movement_type', [
  'opening_stock', 'purchase_receipt', 'sale', 'dispensing', 
  'return', 'branch_transfer', 'adjustment', 'stocktake', 
  'damage', 'expiry', 'recall', 'quarantine'
]);

// 1. Core Organization
export const tenants = pgTable('tenants', {
  id: serial('id').primaryKey(),
  tradingName: varchar('trading_name', { length: 255 }).notNull(),
  kraPin: varchar('kra_pin', { length: 50 }),
  ppbLicense: varchar('ppb_license', { length: 100 }),
  isActive: boolean('is_active').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const branches = pgTable('branches', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  branchName: varchar('branch_name', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }),
  isActive: boolean('is_active').default(true),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  branchId: integer('branch_id').references(() => branches.id),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Catalog & Pricing
export const medicineCategories = pgTable('medicine_categories', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
});

export const medicines = pgTable('medicines', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  categoryId: integer('category_id').references(() => medicineCategories.id),
  medicineName: varchar('medicine_name', { length: 255 }).notNull(),
  genericName: varchar('generic_name', { length: 255 }),
  activeIngredients: text('active_ingredients'),
  sku: varchar('sku', { length: 100 }),
  barcode: varchar('barcode', { length: 100 }),
  dosageForm: varchar('dosage_form', { length: 100 }), 
  strength: varchar('strength', { length: 100 }),
  packSize: integer('pack_size').default(1),
  unitOfMeasure: varchar('unit_of_measure', { length: 50 }),
  prescriptionClass: varchar('prescription_class', { length: 50 }),
  imageUrl: varchar('image_url', { length: 255 }), // Added for product images
  isArchived: boolean('is_archived').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const medicinePrices = pgTable('medicine_prices', {
  id: serial('id').primaryKey(),
  medicineId: integer('medicine_id').references(() => medicines.id).notNull(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  branchId: integer('branch_id').references(() => branches.id),
  unitPurchaseCost: decimal('unit_purchase_cost', { precision: 10, scale: 2 }),
  unitSellingPrice: decimal('unit_selling_price', { precision: 10, scale: 2 }).notNull(),
  packPurchaseCost: decimal('pack_purchase_cost', { precision: 10, scale: 2 }),
  packSellingPrice: decimal('pack_selling_price', { precision: 10, scale: 2 }),
  effectiveDate: timestamp('effective_date').defaultNow(),
});

// 3. Suppliers
export const suppliers = pgTable('suppliers', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  contactPerson: varchar('contact_person', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  taxPin: varchar('tax_pin', { length: 100 }),
  paymentTerms: varchar('payment_terms', { length: 100 }),
  outstandingBalance: decimal('outstanding_balance', { precision: 12, scale: 2 }).default('0.00'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. Inventory & Batches
export const medicineBatches = pgTable('medicine_batches', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  medicineId: integer('medicine_id').references(() => medicines.id).notNull(),
  batchNumber: varchar('batch_number', { length: 100 }).notNull(),
  supplierId: integer('supplier_id').references(() => suppliers.id),
  manufacturingDate: date('manufacturing_date'),
  expiryDate: date('expiry_date').notNull(),
  receivedDate: timestamp('received_date').defaultNow(),
  initialQuantity: integer('initial_quantity').notNull(),
  currentQuantity: integer('current_quantity').notNull(),
  isQuarantined: boolean('is_quarantined').default(false),
});

export const inventoryBalances = pgTable('inventory_balances', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  branchId: integer('branch_id').references(() => branches.id).notNull(),
  medicineId: integer('medicine_id').references(() => medicines.id).notNull(),
  totalQuantity: integer('total_quantity').notNull().default(0),
  reorderThreshold: integer('reorder_threshold').default(10),
  targetStockLevel: integer('target_stock_level').default(50),
});

export const stockMovements = pgTable('stock_movements', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  branchId: integer('branch_id').references(() => branches.id).notNull(),
  medicineId: integer('medicine_id').references(() => medicines.id).notNull(),
  batchId: integer('batch_id').references(() => medicineBatches.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  movementType: movementTypeEnum('movement_type').notNull(),
  quantity: integer('quantity').notNull(),
  reference: varchar('reference', { length: 255 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 5. Sales & POS
export const sales = pgTable('sales', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  branchId: integer('branch_id').references(() => branches.id).notNull(),
  cashierId: integer('cashier_id').references(() => users.id).notNull(),
  receiptNumber: varchar('receipt_number', { length: 100 }).notNull().unique(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  discount: decimal('discount', { precision: 10, scale: 2 }).default('0.00'),
  tax: decimal('tax', { precision: 10, scale: 2 }).default('0.00'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  paymentStatus: varchar('payment_status', { length: 50 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const saleItems = pgTable('sale_items', {
  id: serial('id').primaryKey(),
  saleId: integer('sale_id').references(() => sales.id).notNull(),
  medicineId: integer('medicine_id').references(() => medicines.id).notNull(),
  batchId: integer('batch_id').references(() => medicineBatches.id).notNull(),
  quantity: integer('quantity').notNull(),
  unitSellingPrice: decimal('unit_selling_price', { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
});

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  saleId: integer('sale_id').references(() => sales.id).notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  providerReference: varchar('provider_reference', { length: 255 }),
  status: varchar('status', { length: 50 }).default('completed'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 6. Prescriptions & Clinical
export const patients = pgTable('patients', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  identifier: varchar('identifier', { length: 100 }),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  dateOfBirth: date('date_of_birth'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const prescribers = pgTable('prescribers', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  licenseNumber: varchar('license_number', { length: 100 }),
  facility: varchar('facility', { length: 255 }),
});

export const prescriptions = pgTable('prescriptions', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  branchId: integer('branch_id').references(() => branches.id).notNull(),
  patientId: integer('patient_id').references(() => patients.id).notNull(),
  prescriberId: integer('prescriber_id').references(() => prescribers.id),
  verificationStatus: varchar('verification_status', { length: 50 }).default('pending'),
  dispensingStatus: varchar('dispensing_status', { length: 50 }).default('pending'),
  verifiedBy: integer('verified_by').references(() => users.id),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const prescriptionItems = pgTable('prescription_items', {
  id: serial('id').primaryKey(),
  prescriptionId: integer('prescription_id').references(() => prescriptions.id).notNull(),
  medicineId: integer('medicine_id').references(() => medicines.id).notNull(),
  prescribedQuantity: integer('prescribed_quantity').notNull(),
  instructions: text('instructions'),
  refillAuthorized: integer('refill_authorized').default(0),
});

export const dispensingRecords = pgTable('dispensing_records', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  prescriptionId: integer('prescription_id').references(() => prescriptions.id).notNull(),
  dispenserId: integer('dispenser_id').references(() => users.id).notNull(),
  dispensedAt: timestamp('dispensed_at').defaultNow(),
});

export const dispensingItems = pgTable('dispensing_items', {
  id: serial('id').primaryKey(),
  dispensingRecordId: integer('dispensing_record_id').references(() => dispensingRecords.id).notNull(),
  prescriptionItemId: integer('prescription_item_id').references(() => prescriptionItems.id).notNull(),
  batchId: integer('batch_id').references(() => medicineBatches.id).notNull(),
  dispensedQuantity: integer('dispensed_quantity').notNull(),
});

// 7. Customers & Insurance
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  customerType: varchar('customer_type', { length: 50 }).default('retail'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const insuranceProviders = pgTable('insurance_providers', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  providerName: varchar('provider_name', { length: 255 }).notNull(),
  contactPerson: varchar('contact_person', { length: 255 }),
  supportEmail: varchar('support_email', { length: 255 }),
  isActive: boolean('is_active').default(true),
});

export const insurancePolicies = pgTable('insurance_policies', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id).notNull(),
  providerId: integer('provider_id').references(() => insuranceProviders.id).notNull(),
  policyNumber: varchar('policy_number', { length: 100 }).notNull(),
  memberNumber: varchar('member_number', { length: 100 }),
  principalMember: varchar('principal_member', { length: 255 }),
  validUntil: date('valid_until'),
  isActive: boolean('is_active').default(true),
});

export const insuranceClaims = pgTable('insurance_claims', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  branchId: integer('branch_id').references(() => branches.id).notNull(),
  saleId: integer('sale_id').references(() => sales.id).notNull(),
  providerId: integer('provider_id').references(() => insuranceProviders.id).notNull(),
  policyId: integer('policy_id').references(() => insurancePolicies.id).notNull(),
  claimReference: varchar('claim_reference', { length: 100 }).unique(),
  totalClaimAmount: decimal('total_claim_amount', { precision: 10, scale: 2 }).notNull(),
  approvedAmount: decimal('approved_amount', { precision: 10, scale: 2 }),
  status: varchar('status', { length: 50 }).default('prepared'),
  submittedAt: timestamp('submitted_at'),
  reconciledAt: timestamp('reconciled_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 8. Purchasing
export const purchaseOrders = pgTable('purchase_orders', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  branchId: integer('branch_id').references(() => branches.id).notNull(),
  supplierId: integer('supplier_id').references(() => suppliers.id).notNull(),
  poNumber: varchar('po_number', { length: 100 }).notNull().unique(),
  status: varchar('status', { length: 50 }).default('draft'),
  expectedDeliveryDate: date('expected_delivery_date'),
  totalExpectedCost: decimal('total_expected_cost', { precision: 12, scale: 2 }).notNull(),
  createdBy: integer('created_by').references(() => users.id).notNull(),
  approvedBy: integer('approved_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const purchaseOrderItems = pgTable('purchase_order_items', {
  id: serial('id').primaryKey(),
  purchaseOrderId: integer('purchase_order_id').references(() => purchaseOrders.id).notNull(),
  medicineId: integer('medicine_id').references(() => medicines.id).notNull(),
  expectedQuantity: integer('expected_quantity').notNull(),
  receivedQuantity: integer('received_quantity').default(0),
  expectedUnitCost: decimal('expected_unit_cost', { precision: 10, scale: 2 }).notNull(),
});

export const supplierInvoices = pgTable('supplier_invoices', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  supplierId: integer('supplier_id').references(() => suppliers.id).notNull(),
  purchaseOrderId: integer('purchase_order_id').references(() => purchaseOrders.id),
  invoiceNumber: varchar('invoice_number', { length: 100 }).notNull(),
  invoiceTotal: decimal('invoice_total', { precision: 12, scale: 2 }).notNull(),
  paymentStatus: varchar('payment_status', { length: 50 }).default('unpaid'),
  dueDate: date('due_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 9. Compliance & Auditing
export const cashierShifts = pgTable('cashier_shifts', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  branchId: integer('branch_id').references(() => branches.id).notNull(),
  cashierId: integer('cashier_id').references(() => users.id).notNull(),
  openedAt: timestamp('opened_at').defaultNow().notNull(),
  closedAt: timestamp('closed_at'),
  openingCashBalance: decimal('opening_cash_balance', { precision: 10, scale: 2 }).notNull(),
  expectedCashAmount: decimal('expected_cash_amount', { precision: 10, scale: 2 }),
  actualCashAmount: decimal('actual_cash_amount', { precision: 10, scale: 2 }),
  variance: decimal('variance', { precision: 10, scale: 2 }),
  status: varchar('status', { length: 50 }).default('open'),
  reconciliationNotes: text('reconciliation_notes'),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  branchId: integer('branch_id').references(() => branches.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  recordType: varchar('record_type', { length: 100 }).notNull(),
  recordId: integer('record_id').notNull(),
  previousValues: jsonb('previous_values'),
  newValues: jsonb('new_values'),
  reason: text('reason'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const taxInvoices = pgTable('tax_invoices', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  saleId: integer('sale_id').references(() => sales.id).notNull(),
  etimsInvoiceNumber: varchar('etims_invoice_number', { length: 255 }),
  taxableAmount: decimal('taxable_amount', { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }).notNull(),
  submissionStatus: varchar('submission_status', { length: 50 }).default('pending'),
  integrationResponseLogs: jsonb('integration_response_logs'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 10. AI & Forecasting
export const forecastRuns = pgTable('forecast_runs', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  branchId: integer('branch_id').references(() => branches.id).notNull(),
  runDate: timestamp('run_date').defaultNow(),
  analyzedPeriodDays: integer('analyzed_period_days').notNull(),
  status: varchar('status', { length: 50 }).default('completed'),
});

export const aiRecommendations = pgTable('ai_recommendations', {
  id: serial('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id).notNull(),
  forecastRunId: integer('forecast_run_id').references(() => forecastRuns.id),
  medicineId: integer('medicine_id').references(() => medicines.id).notNull(),
  recommendationType: varchar('recommendation_type', { length: 50 }).notNull(),
  suggestedQuantity: integer('suggested_quantity'),
  confidenceScore: decimal('confidence_score', { precision: 5, scale: 2 }),
  explanation: text('explanation').notNull(),
  status: varchar('status', { length: 50 }).default('pending_review'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const aiApprovals = pgTable('ai_approvals', {
  id: serial('id').primaryKey(),
  recommendationId: integer('recommendation_id').references(() => aiRecommendations.id).notNull(),
  reviewedBy: integer('reviewed_by').references(() => users.id).notNull(),
  actionTaken: varchar('action_taken', { length: 50 }).notNull(),
  resultingPurchaseRequestId: integer('resulting_purchase_request_id'),
  reviewNotes: text('review_notes'),
  reviewedAt: timestamp('reviewed_at').defaultNow(),
});
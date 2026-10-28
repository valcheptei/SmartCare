import request from 'supertest';
import express from 'express';
// Import your configured Express app and database connection
import app from '../index'; 
import { db } from '../db/index'; // <-- Add /index here
import { medicineBatches, inventoryBalances } from '../db/schema';
import { eq } from 'drizzle-orm';

// Mock authentication/tenant middleware for testing
const TENANT_HEADERS = { 'x-tenant-id': '1', 'Authorization': 'Bearer test-token' };

describe('Workflow A: End-to-End Medicine Setup and Sale', () => {
  let createdMedicineId: number;
  const mockBatchNumber = `TEST-BATCH-${Date.now()}`;
  const initialQuantity = 100;
  const saleQuantity = 2;

  it('Step 1: Create Medicine & Set Price', async () => {
    const response = await request(app)
      .post('/api/medicines')
      .set(TENANT_HEADERS)
      .send({
        tenantId: 1,
        medicineName: 'E2E Test Amoxicillin 500mg',
        dosageForm: 'capsule',
        unitSellingPrice: 50.00,
        packSize: 100
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    createdMedicineId = response.body.id;
  });

  it('Step 2: Receive Batch & Record Expiry', async () => {
    const response = await request(app)
      .post('/api/inventory/receive')
      .set(TENANT_HEADERS)
      .send({
        tenantId: 1,
        branchId: 1,
        medicineId: createdMedicineId,
        batchNumber: mockBatchNumber,
        expiryDate: '2028-12-31', // Valid future expiry
        quantity: initialQuantity,
        reference: 'PO-TEST-001'
      });

    expect(response.status).toBe(201);
  });

  it('Step 3: Process POS Checkout (M-Pesa Mock)', async () => {
    // Retrieve the generated batch ID
    const batchRecord = await db.select().from(medicineBatches).where(eq(medicineBatches.batchNumber, mockBatchNumber));
    const batchId = batchRecord[0].id;

    const response = await request(app)
      .post('/api/pos/checkout')
      .set(TENANT_HEADERS)
      .send({
        tenantId: 1,
        branchId: 1,
        paymentMethod: 'mpesa',
        mpesaReference: 'OQ89TESTX', // Mocked provider reference
        items: [{
          medicineId: createdMedicineId,
          batchId: batchId,
          quantity: saleQuantity,
          unitSellingPrice: 50.00
        }]
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Transaction successful');
  });

  it('Step 4: Verify Exact Batch Deduction & Inventory Update', async () => {
    // Verify specific batch quantity
    const batchRecord = await db.select().from(medicineBatches).where(eq(medicineBatches.batchNumber, mockBatchNumber));
    expect(batchRecord[0].currentQuantity).toBe(initialQuantity - saleQuantity);

    // Verify branch inventory balance
    const inventoryRecord = await db.select().from(inventoryBalances).where(eq(inventoryBalances.medicineId, createdMedicineId));
    expect(inventoryRecord[0].totalQuantity).toBe(initialQuantity - saleQuantity);
  });
});
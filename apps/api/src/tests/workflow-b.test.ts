import request from 'supertest';
import app from '../index'; 
import { db } from '../db/index'; // Explicitly targeting the newly generated index file
import { medicineBatches, dispensingRecords } from '../db/schema';
import { eq } from 'drizzle-orm';

const TENANT_HEADERS = { 'x-tenant-id': '1', 'Authorization': 'Bearer test-pharmacist-token' };

describe('Workflow B: End-to-End Prescription Dispensing', () => {
  let prescriptionId: number;
  let prescriptionItemId: number;
  const mockPatientId = 1; 
  const mockPrescriberId = 1;
  const mockMedicineId = 1; 
  const mockBatchId = 1;

  it('Step 1: Capture Prescription (Pending Verification)', async () => {
    const response = await request(app)
      .post('/api/prescriptions')
      .set(TENANT_HEADERS)
      .send({
        tenantId: 1,
        branchId: 1,
        patientId: mockPatientId,
        prescriberId: mockPrescriberId,
        notes: 'Take with food',
        items: [{
          medicineId: mockMedicineId,
          quantity: 30,
          instructions: '1 tablet daily',
          refills: 0
        }]
      });

    expect(response.status).toBe(201);
    expect(response.body.verificationStatus).toBe('pending');
    prescriptionId = response.body.id;
    prescriptionItemId = 1; 
  });

  it('Step 2: Authorized Professional Review & Dispensing', async () => {
    const response = await request(app)
      .post('/api/prescriptions/dispense')
      .set(TENANT_HEADERS)
      .send({
        tenantId: 1,
        branchId: 1,
        prescriptionId: prescriptionId,
        dispensingData: [{
          prescriptionItemId: prescriptionItemId,
          medicineId: mockMedicineId,
          batchId: mockBatchId,
          quantity: 30
        }]
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Prescription verified and dispensed successfully');
  });

  it('Step 3: Verify Dispensing History & Audit Logging', async () => {
    const records = await db.select().from(dispensingRecords).where(eq(dispensingRecords.prescriptionId, prescriptionId));
    expect(records.length).toBe(1);
    expect(records[0].dispenserId).toBeDefined();
  });
});
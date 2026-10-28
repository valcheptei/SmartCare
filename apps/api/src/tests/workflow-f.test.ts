import request from 'supertest';
import app from '../index'; 

const TENANT_HEADERS = { 'x-tenant-id': '1' };

describe('Workflow F: M-Pesa Payment & Callback Verification', () => {
  const mockCheckoutRequestId = `ws_${Date.now()}`;

  it('Step 1: Initiate M-Pesa STK Push', async () => {
    const response = await request(app)
      .post('/api/pos/mpesa/stkpush')
      .set(TENANT_HEADERS)
      .send({
        phoneNumber: '254700000000',
        amount: 1500
      });

    expect(response.status).toBe(200);
    expect(response.body.mockCheckoutRequestId).toBeDefined();
  });

  it('Step 2: Reject Unverified/Invalid Provider Callback', async () => {
    // Simulating a webhook call hitting the abstraction layer without proper Safaricom signatures
    const response = await request(app)
      .post('/api/pos/mpesa/callback')
      .send({
        Body: {
          stkCallback: {
            MerchantRequestID: 'invalid_req',
            CheckoutRequestID: mockCheckoutRequestId,
            ResultCode: 0,
            ResultDesc: 'Success'
          }
        }
      });

    // The backend must reject this because it lacks authorization/verification headers
    expect(response.status).toBe(403); 
  });
});
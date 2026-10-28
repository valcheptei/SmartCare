import { Router, Request, Response } from 'express';

const router = Router();

// In-memory mock database for insurance claims and providers
let claims = [
  {
    id: 1,
    tenantId: 1,
    branchId: 1,
    patientName: 'John Doe',
    insuranceProvider: 'SHA (formerly NHIF)',
    policyNumber: 'NHIF-99201823',
    claimAmount: '4500.00',
    status: 'APPROVED',
    submittedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    id: 2,
    tenantId: 1,
    branchId: 1,
    patientName: 'Mercy Cheptoo',
    insuranceProvider: 'Jubilee Insurance',
    policyNumber: 'JUB-8839201',
    claimAmount: '12800.00',
    status: 'PENDING',
    submittedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
  }
];

// GET /api/insurance - Fetch all insurance claims for the tenant
router.get('/', async (req: Request, res: Response) => {
  try {
    const currentTenantId = parseInt(req.headers['x-tenant-id'] as string, 10);

    const tenantClaims = claims
      .filter(c => c.tenantId === currentTenantId)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return res.json(tenantClaims);
  } catch (error) {
    console.error('Error fetching insurance claims:', error);
    return res.status(500).json({ error: 'Failed to fetch insurance claims' });
  }
});

// POST /api/insurance - Submit a new claim or provider record
router.post('/', async (req: Request, res: Response) => {
  try {
    const currentTenantId = parseInt(req.headers['x-tenant-id'] as string, 10);
    const { patientName, insuranceProvider, policyNumber, claimAmount } = req.body;

    if (!patientName || !insuranceProvider || !policyNumber || !claimAmount) {
      return res.status(400).json({ error: 'Missing required claim fields.' });
    }

    const newClaim = {
      id: claims.length > 0 ? Math.max(...claims.map(c => c.id)) + 1 : 1,
      tenantId: currentTenantId,
      branchId: 1,
      patientName,
      insuranceProvider,
      policyNumber,
      claimAmount: parseFloat(claimAmount).toFixed(2),
      status: 'PENDING',
      submittedAt: new Date().toISOString()
    };

    claims.push(newClaim);
    return res.status(201).json(newClaim);
  } catch (error) {
    console.error('Error submitting claim:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
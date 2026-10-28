import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    // Standard response payload that your frontend expects
    return res.json([
      {
        id: 1,
        tenantId: 1,
        eventType: 'LICENSE_RENEWAL',
        status: 'pending',
        details: { license_number: 'PHARM-2026-A', due_date: '2026-12-31' },
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        tenantId: 1,
        eventType: 'INVENTORY_AUDIT',
        status: 'completed',
        details: { auditor: 'Jane Smith', discrepancies: 0 },
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
      }
    ]);
  } catch (error) {
    console.error('Error fetching compliance events:', error);
    return res.json([]);
  }
});

export default router;
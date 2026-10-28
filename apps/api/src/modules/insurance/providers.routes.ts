import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    // Return sample data matching the database schema
    return res.json([
      {
        id: 1,
        providerName: 'Jubilee Insurance',
        contactPhone: '+254700000000',
        email: 'health@jubilee.co.ke',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        providerName: 'AAR Insurance',
        contactPhone: '+254711111111',
        email: 'info@aar.co.ke',
        createdAt: new Date().toISOString()
      }
    ]);
  } catch (error) {
    console.error('Error fetching insurance providers:', error);
    // Ensure you return a clean 500 error rather than crashing the request
    return res.status(500).json({ error: 'Failed to fetch insurance providers' });
  }
});

export default router;
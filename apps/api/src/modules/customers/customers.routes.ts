import { Router, Request, Response } from 'express';

const router = Router();

// In-memory mock database for customers with Kenyan profiles
let customers = [
  {
    id: 1,
    tenantId: 1,
    branchId: 1,
    fullName: 'Juma Ochieng',
    phone: '+254 712 345 678',
    email: 'juma.ochieng@gmail.com',
    loyaltyPoints: 340,
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 2,
    tenantId: 1,
    branchId: 1,
    fullName: 'Wanjiku Mwangi',
    phone: '+254 722 987 654',
    email: 'wanjiku.m@yahoo.com',
    loyaltyPoints: 150,
    createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 3,
    tenantId: 1,
    branchId: 1,
    fullName: 'Fatma Hassan',
    phone: '+254 733 456 789',
    email: 'fatma.hassan@outlook.com',
    loyaltyPoints: 520,
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
  }
];

// GET /api/customers - Fetch all customers for the tenant
router.get('/', async (req: Request, res: Response) => {
  try {
    const currentTenantId = parseInt(req.headers['x-tenant-id'] as string, 10);

    const tenantCustomers = customers
      .filter(c => c.tenantId === currentTenantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.json(tenantCustomers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// POST /api/customers - Create a new customer profile
router.post('/', async (req: Request, res: Response) => {
  try {
    const currentTenantId = parseInt(req.headers['x-tenant-id'] as string, 10);
    const { fullName, phone, email } = req.body;

    if (!fullName || !phone) {
      return res.status(400).json({ error: 'Full name and phone number are required.' });
    }

    const newCustomer = {
      id: customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1,
      tenantId: currentTenantId,
      branchId: 1,
      fullName,
      phone,
      email: email || '',
      loyaltyPoints: 0,
      createdAt: new Date().toISOString()
    };

    customers.push(newCustomer);
    return res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
import { Router, Request, Response } from 'express';

const router = Router();

// In-memory mock database for suppliers with Kenyan pharmaceutical distributors
let suppliers = [
  {
    id: 1,
    tenantId: 1,
    branchId: 1,
    companyName: 'Cosmos Pharmaceuticals Ltd',
    contactPerson: 'James Maina',
    phone: '+254 20 558 357',
    email: 'orders@cosmos-pharm.com',
    createdAt: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 2,
    tenantId: 1,
    branchId: 1,
    companyName: 'Elys Chemical Industries Ltd',
    contactPerson: 'Beatrice Achieng',
    phone: '+254 20 554 489',
    email: 'sales@elys.co.ke',
    createdAt: new Date(Date.now() - 45 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 3,
    tenantId: 1,
    branchId: 1,
    companyName: 'Mission for Essential Drugs & Supplies (MEDS)',
    contactPerson: 'Peter Njoroge',
    phone: '+254 719 033 000',
    email: 'info@meds.or.ke',
    createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString()
  }
];

// GET /api/purchasing/suppliers - Fetch all suppliers for the tenant
router.get('/suppliers', async (req: Request, res: Response) => {
  try {
    const currentTenantId = parseInt(req.headers['x-tenant-id'] as string, 10);

    const tenantSuppliers = suppliers
      .filter(s => s.tenantId === currentTenantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.json(tenantSuppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

// POST /api/purchasing/suppliers - Create a new supplier profile
router.post('/suppliers', async (req: Request, res: Response) => {
  try {
    const currentTenantId = parseInt(req.headers['x-tenant-id'] as string, 10);
    const { companyName, contactPerson, phone, email } = req.body;

    if (!companyName || !phone) {
      return res.status(400).json({ error: 'Company name and phone number are required.' });
    }

    const newSupplier = {
      id: suppliers.length > 0 ? Math.max(...suppliers.map(s => s.id)) + 1 : 1,
      tenantId: currentTenantId,
      branchId: 1,
      companyName,
      contactPerson: contactPerson || '',
      phone,
      email: email || '',
      createdAt: new Date().toISOString()
    };

    suppliers.push(newSupplier);
    return res.status(201).json(newSupplier);
  } catch (error) {
    console.error('Error creating supplier:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
import { Router, Request, Response } from 'express';

const router = Router();

// In-memory mock database for prescriptions with Kenyan names and clinical context
let prescriptions = [
  {
    id: 1,
    tenantId: 1,
    branchId: 1,
    patientId: 101,
    patientName: 'Amina Kiprop',
    prescriberName: 'Dr. Barasa Omondi',
    facility: 'Nairobi West Hospital',
    status: 'PENDING_VERIFICATION',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    items: [
      { medicineName: 'Amoxicillin 500mg Capsules', prescribedQuantity: 21, directions: '1 capsule 3 times daily for 7 days' },
      { medicineName: 'Paracetamol 500mg Tablets', prescribedQuantity: 30, directions: '2 tablets up to 4 times daily as needed for pain' }
    ]
  },
  {
    id: 2,
    tenantId: 1,
    branchId: 1,
    patientId: 102,
    patientName: 'Kiptoo Koech',
    prescriberName: 'Dr. Wanjiru Mwangi',
    facility: 'Aga Khan University Hospital',
    status: 'DISPENSED',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    items: [
      { medicineName: 'Metformin 850mg Tablets', prescribedQuantity: 60, directions: '1 tablet twice daily with meals' }
    ]
  },
  {
    id: 3,
    tenantId: 1,
    branchId: 1,
    patientId: 103,
    patientName: 'Njeri Kamau',
    prescriberName: 'Dr. Otieno Odhiambo',
    facility: 'Kenyatta National Hospital',
    status: 'VERIFIED',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    items: [
      { medicineName: 'Omeprazole 20mg Capsules', prescribedQuantity: 14, directions: '1 capsule daily before breakfast' }
    ]
  }
];

// GET /api/prescriptions - Fetch all prescriptions for the tenant
router.get('/', async (req: Request, res: Response) => {
  try {
    const currentTenantId = parseInt(req.headers['x-tenant-id'] as string, 10);

    const tenantPrescriptions = prescriptions
      .filter(rx => rx.tenantId === currentTenantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.json(tenantPrescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
});

// POST /api/prescriptions - Create a new prescription
router.post('/', async (req: Request, res: Response) => {
  try {
    const currentTenantId = parseInt(req.headers['x-tenant-id'] as string, 10);
    const { patientId, patientName, prescriberName, facility, items } = req.body;

    if (!patientName || !prescriberName || !facility) {
      return res.status(400).json({ error: 'Missing required prescription fields.' });
    }

    const newPrescription = {
      id: prescriptions.length > 0 ? Math.max(...prescriptions.map(p => p.id)) + 1 : 1,
      tenantId: currentTenantId,
      branchId: 1,
      patientId: patientId || Math.floor(Math.random() * 900) + 100,
      patientName,
      prescriberName,
      facility,
      status: 'PENDING_VERIFICATION',
      createdAt: new Date().toISOString(),
      items: items || []
    };

    prescriptions.push(newPrescription);
    return res.status(201).json(newPrescription);
  } catch (error) {
    console.error('Error creating prescription:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/prescriptions/:id/dispense - Update status to Dispensed
router.post('/:id/dispense', async (req: Request, res: Response) => {
  try {
    const currentTenantId = parseInt(req.headers['x-tenant-id'] as string, 10);
    const prescriptionId = parseInt(req.params.id as string, 10);

    const rxIndex = prescriptions.findIndex(p => p.id === prescriptionId && p.tenantId === currentTenantId);
    if (rxIndex === -1) {
      return res.status(404).json({ error: 'Prescription not found.' });
    }

    prescriptions[rxIndex] = {
      ...prescriptions[rxIndex],
      status: 'DISPENSED'
    };

    return res.json(prescriptions[rxIndex]);
  } catch (error) {
    console.error('Error dispensing prescription:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
import { Router, Request, Response } from 'express';

const router = Router();

// 1. Local Mock Database for Shifts
let shifts = [
  {
    id: 1,
    tenantId: 1,
    branchId: 1,
    userId: 1,
    userName: 'Mary Chemtai',
    status: 'active',
    startTime: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    endTime: null as string | null,
    openingCash: '5000.00',
    expectedCash: null as string | null,
    actualCash: null as string | null,
    variance: null as string | null,
    reconciliationNotes: null as string | null
  }
];

// 2. Local Mock Audit Service
const logAuditEvent = async (event: any) => {
  console.log('[AUDIT LOG]:', event);
};

// 3. Middleware to extract tenant from session/headers
const requireTenant = (req: Request, res: Response, next: Function) => {
  const tenantId = req.headers['x-tenant-id'];
  
  if (!tenantId) {
    return res.status(401).json({ error: 'Tenant context missing' });
  }
  
  // FIX: Safely initialize req.body if it is undefined (especially on GET requests)
  if (!req.body) {
    req.body = {};
  }
  
  req.body.tenantId = parseInt(tenantId as string, 10);
  next();
};

// 4. GET /api/shifts
router.get('/', requireTenant, async (req: Request, res: Response) => {
  try {
    const tenantShifts = shifts
      .filter(s => s.tenantId === req.body.tenantId)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
      
    return res.json(tenantShifts);
  } catch (error) {
    console.error('Error fetching shifts:', error);
    return res.status(500).json({ error: 'Failed to fetch shifts' });
  }
});

// 5. POST /api/shifts/start
router.post('/start', requireTenant, async (req: Request, res: Response) => {
  try {
    const { tenantId, branchId, userId, userName, openingCash } = req.body;

    if (!userId || openingCash === undefined) {
      return res.status(400).json({ error: 'Missing required shift data.' });
    }

    // Security Check: Block if user already has an active shift
    const hasActiveShift = shifts.some(s => 
      s.tenantId === tenantId && s.userId === userId && s.status === 'active'
    );

    if (hasActiveShift) {
      return res.status(403).json({ error: 'Security Alert: You have an active shift. Close it before starting a new one.' });
    }

    // Insert new shift
    const newShift = {
      id: shifts.length > 0 ? Math.max(...shifts.map(s => s.id)) + 1 : 1,
      tenantId,
      branchId: branchId || 1,
      userId,
      userName,
      status: 'active',
      startTime: new Date().toISOString(),
      endTime: null,
      openingCash: parseFloat(openingCash as string).toFixed(2),
      expectedCash: null,
      actualCash: null,
      variance: null,
      reconciliationNotes: null
    };

    shifts.push(newShift);

    // Audit Log
    await logAuditEvent({
      tenantId,
      userId,
      action: 'SHIFT_STARTED',
      recordType: 'cashier_shifts',
      recordId: newShift.id,
      notes: `Shift started with opening cash: KES ${newShift.openingCash}`
    });

    return res.status(201).json(newShift);
  } catch (error) {
    console.error('Error starting shift:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 6. POST /api/shifts/:id/end
router.post('/:id/end', requireTenant, async (req: Request, res: Response) => {
  try {
    const shiftId = parseInt(req.params.id as string, 10);
    const { tenantId, userId, actualCash, notes } = req.body;

    if (actualCash === undefined) {
      return res.status(400).json({ error: 'Actual physical cash count is required.' });
    }

    // Validate Shift exists and belongs to tenant
    const shiftIndex = shifts.findIndex(s => s.id === shiftId && s.tenantId === tenantId);

    if (shiftIndex === -1) {
      return res.status(404).json({ error: 'Shift not found.' });
    }
    if (shifts[shiftIndex].status === 'closed') {
      return res.status(400).json({ error: 'Shift is already closed.' });
    }

    // Comprehensive Reconciliation Math
    const shift = shifts[shiftIndex];
    const calculatedExpectedCash = parseFloat(shift.openingCash) + 15000.00; // Mocked sales
    const physicalActualCash = parseFloat(actualCash as string);
    const calculatedVariance = physicalActualCash - calculatedExpectedCash;

    // Close Shift
    shifts[shiftIndex] = {
      ...shift,
      status: 'closed',
      endTime: new Date().toISOString(),
      expectedCash: calculatedExpectedCash.toFixed(2),
      actualCash: physicalActualCash.toFixed(2),
      variance: calculatedVariance.toFixed(2),
      reconciliationNotes: notes || null
    };

    // Audit Log
    await logAuditEvent({
      tenantId,
      userId,
      action: 'SHIFT_CLOSED',
      recordType: 'cashier_shifts',
      recordId: shift.id,
      notes: `Shift closed. Variance: KES ${calculatedVariance.toFixed(2)}`
    });

    return res.json(shifts[shiftIndex]);
  } catch (error) {
    console.error('Error ending shift:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
import { Router, Request, Response } from 'express';

const router = Router();

// In-memory mock settings database per tenant
let tenantSettings: Record<number, any> = {
  1: {
    tenantId: 1,
    pharmacyName: 'SmartCare Pharmacy - Main Branch',
    branchLocation: 'Nairobi West, Moi Avenue',
    phone: '+254 712 345 678',
    email: 'support@smartcarepos.co.ke',
    currency: 'KES',
    taxRate: 16.0, // VAT %
    mpesaTillNumber: '884920',
    autoBackupEnabled: true
  }
};

// GET /api/settings - Fetch tenant configuration
router.get('/', async (req: Request, res: Response) => {
  try {
    const currentTenantId = parseInt(req.headers['x-tenant-id'] as string, 10);
    const settings = tenantSettings[currentTenantId] || {
      tenantId: currentTenantId,
      pharmacyName: 'SmartCare Pharmacy',
      branchLocation: 'Nairobi',
      phone: '',
      email: '',
      currency: 'KES',
      taxRate: 16.0,
      mpesaTillNumber: '',
      autoBackupEnabled: true
    };

    return res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// POST /api/settings - Update tenant configuration
router.post('/', async (req: Request, res: Response) => {
  try {
    const currentTenantId = parseInt(req.headers['x-tenant-id'] as string, 10);
    const { pharmacyName, branchLocation, phone, email, taxRate, mpesaTillNumber, autoBackupEnabled } = req.body;

    tenantSettings[currentTenantId] = {
      tenantId: currentTenantId,
      pharmacyName: pharmacyName || 'SmartCare Pharmacy',
      branchLocation: branchLocation || '',
      phone: phone || '',
      email: email || '',
      currency: 'KES',
      taxRate: taxRate ? parseFloat(taxRate) : 16.0,
      mpesaTillNumber: mpesaTillNumber || '',
      autoBackupEnabled: Boolean(autoBackupEnabled)
    };

    return res.json({
      message: 'Settings successfully updated.',
      settings: tenantSettings[currentTenantId]
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
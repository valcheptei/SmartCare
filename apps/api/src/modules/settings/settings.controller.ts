import { Request, Response } from 'express';

// In-memory mock settings and notifications store
let systemSettings = {
  tenantId: 1,
  pharmacyName: 'SmartCare Pharmacy (Main Branch)',
  currency: 'KES',
  taxRatePercent: 16.0,
  mpesaTillNumber: '8849201',
  lowStockAlertThreshold: 10,
  autoApprovalEnabled: false
};

let notifications = [
  {
    id: 1,
    tenantId: 1,
    title: 'Low Stock Warning',
    message: 'Amoxicillin 500mg stock is below 150 units.',
    type: 'WARNING',
    read: false,
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString()
  },
  {
    id: 2,
    tenantId: 1,
    title: 'Insurance Claim Approved',
    message: 'Claim #CLM-101 for KES 4,500.00 was approved by SHA.',
    type: 'SUCCESS',
    read: true,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  }
];

export const getSettingsHandler = async (req: Request, res: Response) => {
  try {
    return res.json(systemSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const updateSettingsHandler = async (req: Request, res: Response) => {
  try {
    const { pharmacyName, currency, taxRatePercent, mpesaTillNumber, lowStockAlertThreshold } = req.body;
    
    systemSettings = {
      ...systemSettings,
      pharmacyName: pharmacyName || systemSettings.pharmacyName,
      currency: currency || systemSettings.currency,
      taxRatePercent: taxRatePercent !== undefined ? parseFloat(taxRatePercent) : systemSettings.taxRatePercent,
      mpesaTillNumber: mpesaTillNumber || systemSettings.mpesaTillNumber,
      lowStockAlertThreshold: lowStockAlertThreshold !== undefined ? parseInt(lowStockAlertThreshold, 10) : systemSettings.lowStockAlertThreshold
    };

    return res.json({ message: 'Settings updated successfully', settings: systemSettings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json({ error: 'Failed to update settings' });
  }
};

export const getNotificationsHandler = async (req: Request, res: Response) => {
  try {
    return res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markNotificationReadHandler = async (req: Request, res: Response) => {
  try {
    const notifId = parseInt(req.params.id as string, 10);
    notifications = notifications.map(n => n.id === notifId ? { ...n, read: true } : n);
    return res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error updating notification:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
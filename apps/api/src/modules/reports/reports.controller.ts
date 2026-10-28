import { Request, Response } from 'express';

export const getReportsHandler = async (req: Request, res: Response) => {
  try {
    const currentTenantId = parseInt(req.headers['x-tenant-id'] as string, 10);
    const reportType = (req.query.type as string) || 'sales';

    let reportData;

    switch (reportType) {
      case 'inventory':
        reportData = {
          type: 'inventory',
          title: 'Stock Valuation & Expiry Report',
          columns: ['Medicine Name', 'Batch Number', 'Stock Qty', 'Unit Cost (KES)', 'Total Value (KES)', 'Expiry Date'],
          rows: [
            ['Amoxicillin 500mg', 'BAT-2026-01', 250, '15.00', '3,750.00', '2027-08-15'],
            ['Paracetamol 500mg', 'BAT-2026-02', 800, '3.50', '2,800.00', '2028-01-10'],
            ['Metformin 850mg', 'BAT-2025-09', 370, '10.00', '3,700.00', '2026-11-20'],
          ]
        };
        break;

      case 'financial':
        reportData = {
          type: 'financial',
          title: 'Financial & Gross Margin Summary',
          columns: ['Transaction Date', 'Receipt #', 'Payment Method', 'Revenue (KES)', 'COGS (KES)', 'Gross Profit (KES)'],
          rows: [
            ['2026-10-24 14:32', 'REC-1792831', 'M-Pesa', '4,500.00', '2,900.00', '1,600.00'],
            ['2026-10-24 12:15', 'REC-1792822', 'Cash', '1,200.00', '750.00', '450.00'],
            ['2026-10-23 16:45', 'REC-1792750', 'Card', '12,800.00', '8,200.00', '4,600.00'],
          ]
        };
        break;

      case 'insurance':
        reportData = {
          type: 'insurance',
          title: 'Third-Party Payer Claims Reconciliation',
          columns: ['Claim ID', 'Patient Name', 'Provider', 'Policy Number', 'Claim Amount (KES)', 'Status'],
          rows: [
            ['CLM-101', 'John Doe', 'SHA (NHIF)', 'NHIF-99201823', '4,500.00', 'APPROVED'],
            ['CLM-102', 'Mercy Cheptoo', 'Jubilee Insurance', 'JUB-8839201', '12,800.00', 'PENDING'],
            ['CLM-103', 'David Odhiambo', 'Madison Insurance', 'MAD-449201', '3,200.00', 'REJECTED'],
          ]
        };
        break;

      case 'sales':
      default:
        reportData = {
          type: 'sales',
          title: 'Detailed Sales Summary Report',
          columns: ['Receipt Number', 'Date & Time', 'Payment Method', 'Items Count', 'Total (KES)'],
          rows: [
            ['REC-1792831', '2026-10-24 14:32', 'M-Pesa', 3, '4,500.00'],
            ['REC-1792822', '2026-10-24 12:15', 'Cash', 1, '1,200.00'],
            ['REC-1792750', '2026-10-23 16:45', 'Card', 5, '12,800.00'],
            ['REC-1792641', '2026-10-23 09:10', 'M-Pesa', 2, '2,350.00'],
          ]
        };
        break;
    }

    return res.json({ tenantId: currentTenantId, ...reportData });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return res.status(500).json({ error: 'Failed to generate report data' });
  }
};
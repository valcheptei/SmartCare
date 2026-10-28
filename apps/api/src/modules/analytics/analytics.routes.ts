import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/analytics?period=day|week|month|year
router.get('/', async (req: Request, res: Response) => {
  try {
    const currentTenantId = parseInt(req.headers['x-tenant-id'] as string, 10);
    const period = (req.query.period as string) || 'week';

    // Dynamic data generation based on selected timeframe
    let analyticsData;

    switch (period) {
      case 'day':
        analyticsData = {
          period: 'day',
          todaySales: '14200.00',
          todayTransactionsCount: 9,
          grossProfit: '4970.00',
          totalStockQuantity: 1420,
          inventoryValuation: '1250000.00',
          pendingInsuranceClaims: '12800.00',
          outstandingSupplierBalance: '85000.00',
          salesBreakdown: { cash: '6500.00', mpesa: '6200.00', card: '1500.00' },
          trendLabel: 'Hourly Breakdown (Today)',
          dailyTrend: [
            { label: '08:00', sales: 1200 },
            { label: '10:00', sales: 3400 },
            { label: '12:00', sales: 4100 },
            { label: '14:00', sales: 2200 },
            { label: '16:00', sales: 1800 },
            { label: '18:00', sales: 1500 }
          ]
        };
        break;

      case 'month':
        analyticsData = {
          period: 'month',
          todaySales: '842000.00',
          todayTransactionsCount: 540,
          grossProfit: '294700.00',
          totalStockQuantity: 1420,
          inventoryValuation: '1250000.00',
          pendingInsuranceClaims: '45000.00',
          outstandingSupplierBalance: '85000.00',
          salesBreakdown: { cash: '380000.00', mpesa: '372000.00', card: '90000.00' },
          trendLabel: 'Weekly Breakdown (This Month)',
          dailyTrend: [
            { label: 'Week 1', sales: 195000 },
            { label: 'Week 2', sales: 210000 },
            { label: 'Week 3', sales: 225000 },
            { label: 'Week 4', sales: 212000 }
          ]
        };
        break;

      case 'year':
        analyticsData = {
          period: 'year',
          todaySales: '9840000.00',
          todayTransactionsCount: 6420,
          grossProfit: '3444000.00',
          totalStockQuantity: 1420,
          inventoryValuation: '1250000.00',
          pendingInsuranceClaims: '120000.00',
          outstandingSupplierBalance: '85000.00',
          salesBreakdown: { cash: '4200000.00', mpesa: '4440000.00', card: '1200000.00' },
          trendLabel: 'Monthly Breakdown (This Year)',
          dailyTrend: [
            { label: 'Jan', sales: 750000 },
            { label: 'Feb', sales: 810000 },
            { label: 'Mar', sales: 790000 },
            { label: 'Apr', sales: 840000 },
            { label: 'May', sales: 880000 },
            { label: 'Jun', sales: 910000 },
            { label: 'Jul', sales: 850000 },
            { label: 'Aug', sales: 890000 },
            { label: 'Sep', sales: 930000 },
            { label: 'Oct', sales: 960000 },
            { label: 'Nov', sales: 820000 },
            { label: 'Dec', sales: 810000 }
          ]
        };
        break;

      case 'week':
      default:
        analyticsData = {
          period: 'week',
          todaySales: '68450.00',
          todayTransactionsCount: 42,
          grossProfit: '24150.00',
          totalStockQuantity: 1420,
          inventoryValuation: '1250000.00',
          pendingInsuranceClaims: '12800.00',
          outstandingSupplierBalance: '85000.00',
          salesBreakdown: { cash: '32000.00', mpesa: '28450.00', card: '8000.00' },
          trendLabel: 'Daily Breakdown (This Week)',
          dailyTrend: [
            { label: 'Mon', sales: 52000 },
            { label: 'Tue', sales: 61000 },
            { label: 'Wed', sales: 48000 },
            { label: 'Thu', sales: 75000 },
            { label: 'Fri', sales: 89000 },
            { label: 'Sat', sales: 94000 },
            { label: 'Sun', sales: 68450 }
          ]
        };
        break;
    }

    return res.json({ tenantId: currentTenantId, ...analyticsData });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

export default router;
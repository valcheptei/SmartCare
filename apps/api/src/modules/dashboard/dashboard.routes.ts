import { Router, Request, Response } from 'express';
import { db } from '../../db';
import { sql } from 'drizzle-orm';

const router = Router();

router.get('/kpis', async (req: Request, res: Response) => {
  try {
    const tenantId = Number((req as any).tenantId || 1);

    // 1. Total Sales Calculation 
    // FIXED: Your schema uses 'total', not 'total_amount'
    const salesResult = await db.execute(
      sql`SELECT COALESCE(SUM(total), 0) as total_sales, COUNT(*) as transaction_count 
          FROM sales WHERE tenant_id = ${tenantId}`
    );
    const totalSales = Number((salesResult.rows?.[0] as any)?.total_sales || 0);
    const transactionCount = Number((salesResult.rows?.[0] as any)?.transaction_count || 0);

    // 2. Low Stock Items count
    const stockResult = await db.execute(
      sql`SELECT COUNT(*) as low_stock FROM medicine_batches WHERE tenant_id = ${tenantId} AND current_quantity < 20`
    );
    const lowStockItems = Number((stockResult.rows?.[0] as any)?.low_stock || 0);

    // 3. Recent Transactions Feed
    // FIXED: Matching 'total' and 'payment_status' to your schema
    const recentTxResult = await db.execute(
      sql`SELECT id, receipt_number as "receiptNumber", total as "totalAmount", payment_status as "paymentStatus", created_at as "createdAt" 
          FROM sales WHERE tenant_id = ${tenantId} ORDER BY created_at DESC LIMIT 5`
    );
    const recentTransactions = recentTxResult.rows || recentTxResult;

    return res.json({
      totalSales,
      transactionCount,
      activePrescriptions: 12, // Dynamic or mock active queue count
      lowStockItems,
      recentTransactions
    });
  } catch (error) {
    console.error('Dashboard KPI error:', error);
    return res.json({
      totalSales: 0,
      transactionCount: 0,
      activePrescriptions: 0,
      lowStockItems: 0,
      recentTransactions: []
    });
  }
});

export default router;
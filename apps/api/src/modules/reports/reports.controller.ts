import { Request, Response } from 'express';
import { db } from '../../config/db'; 
import { eq, desc, sql, and, gte, lte } from 'drizzle-orm';
import { reportQuerySchema } from './reports.schema';

// IMPORTANT: Ensure this path correctly points to your schema.ts file
import { 
  medicineBatches, medicines, medicinePrices, 
  insuranceClaims, insurancePolicies, customers, insuranceProviders, sales 
} from '../../db/schema'; 

export const getReportsHandler = async (req: Request, res: Response) => {
  try {
    const currentTenantId = parseInt(req.headers['x-tenant-id'] as string) || 1;
    
    // 1. Validate query parameters using Zod
    const queryValidation = reportQuerySchema.safeParse(req.query);
    if (!queryValidation.success) {
      return res.status(400).json({ 
        error: 'Invalid query parameters', 
        details: queryValidation.error.format() 
      });
    }

    const reportType = queryValidation.data.type;
    const startDate = queryValidation.data.startDate ? new Date(queryValidation.data.startDate) : new Date(new Date().setHours(0,0,0,0));
    const endDate = queryValidation.data.endDate ? new Date(queryValidation.data.endDate) : new Date();
    endDate.setHours(23, 59, 59, 999);

    let reportData = {
      type: reportType,
      title: '',
      columns: [] as string[],
      rows: [] as string[][]
    };

    switch (reportType) {
      case 'inventory':
        reportData.title = 'Stock Valuation & Expiry Report';
        reportData.columns = ['Medicine Name', 'Batch Number', 'Stock Qty', 'Unit Cost (KES)', 'Total Value (KES)', 'Expiry Date'];
        
        const invData = await db.select({
          medicineName: medicines.medicineName,
          batchNumber: medicineBatches.batchNumber,
          stockQty: medicineBatches.currentQuantity,
          unitCost: medicinePrices.unitPurchaseCost,
          expiryDate: medicineBatches.expiryDate
        })
        .from(medicineBatches)
        .innerJoin(medicines, eq(medicineBatches.medicineId, medicines.id))
        .leftJoin(medicinePrices, eq(medicines.id, medicinePrices.medicineId))
        .where(eq(medicineBatches.tenantId, currentTenantId))
        .orderBy(medicineBatches.expiryDate);

        reportData.rows = invData.map(item => {
          const cost = Number(item.unitCost || 0);
          const qty = Number(item.stockQty || 0);
          return [
            item.medicineName,
            item.batchNumber,
            String(qty),
            cost.toFixed(2),
            (cost * qty).toFixed(2),
            item.expiryDate || 'N/A'
          ];
        });
        break;

      case 'financial':
        reportData.title = 'Financial & Gross Margin Summary';
        reportData.columns = ['Transaction Date', 'Receipt #', 'Payment Method', 'Revenue (KES)', 'COGS (KES)', 'Gross Profit (KES)'];
        
        const finResult = await db.execute(sql`
          SELECT 
            s.created_at, 
            s.receipt_number, 
            COALESCE(p.payment_method, 'Unknown') as payment_method, 
            s.total as revenue,
            COALESCE(SUM(si.quantity * mp.unit_purchase_cost), 0) as cogs
          FROM sales s
          LEFT JOIN payments p ON s.id = p.sale_id
          LEFT JOIN sale_items si ON s.id = si.sale_id
          LEFT JOIN medicine_prices mp ON si.medicine_id = mp.medicine_id
          WHERE s.tenant_id = ${currentTenantId} 
            AND s.created_at >= ${startDate} 
            AND s.created_at <= ${endDate}
          GROUP BY s.id, p.payment_method
          ORDER BY s.created_at DESC
        `);

        reportData.rows = finResult.rows.map((r: any) => {
          const rev = Number(r.revenue || 0);
          const cogs = Number(r.cogs || 0);
          return [
            new Date(r.created_at).toLocaleString(),
            r.receipt_number,
            r.payment_method.toUpperCase(),
            rev.toFixed(2),
            cogs.toFixed(2),
            (rev - cogs).toFixed(2)
          ];
        });
        break;

      case 'insurance':
        reportData.title = 'Third-Party Payer Claims Reconciliation';
        reportData.columns = ['Claim ID', 'Patient Name', 'Provider', 'Policy Number', 'Claim Amount (KES)', 'Status'];
        
        const insData = await db.select({
          claimRef: insuranceClaims.claimReference,
          patientName: customers.name,
          provider: insuranceProviders.providerName,
          policyNum: insurancePolicies.policyNumber,
          amount: insuranceClaims.totalClaimAmount,
          status: insuranceClaims.status
        })
        .from(insuranceClaims)
        .innerJoin(insurancePolicies, eq(insuranceClaims.policyId, insurancePolicies.id))
        .innerJoin(customers, eq(insurancePolicies.customerId, customers.id))
        .innerJoin(insuranceProviders, eq(insuranceClaims.providerId, insuranceProviders.id))
        .where(
          and(
            eq(insuranceClaims.tenantId, currentTenantId),
            gte(insuranceClaims.createdAt, startDate),
            lte(insuranceClaims.createdAt, endDate)
          )
        )
        .orderBy(desc(insuranceClaims.createdAt));

        reportData.rows = insData.map(claim => [
          claim.claimRef || 'N/A',
          claim.patientName,
          claim.provider,
          claim.policyNum,
          Number(claim.amount || 0).toFixed(2),
          claim.status ? claim.status.toUpperCase() : 'PENDING'
        ]);
        break;

      case 'sales':
      default:
        reportData.type = 'sales';
        reportData.title = 'Detailed Sales Summary Report';
        reportData.columns = ['Receipt Number', 'Date & Time', 'Payment Method', 'Items Count', 'Total (KES)'];
        
        const salesResult = await db.execute(sql`
          SELECT 
            s.receipt_number, 
            s.created_at, 
            COALESCE(p.payment_method, 'Unknown') as payment_method, 
            COUNT(si.id) as items_count, 
            s.total 
          FROM sales s
          LEFT JOIN payments p ON s.id = p.sale_id
          LEFT JOIN sale_items si ON s.id = si.sale_id
          WHERE s.tenant_id = ${currentTenantId} 
            AND s.created_at >= ${startDate} 
            AND s.created_at <= ${endDate}
          GROUP BY s.id, p.payment_method
          ORDER BY s.created_at DESC
        `);

        reportData.rows = salesResult.rows.map((r: any) => [
          r.receipt_number,
          new Date(r.created_at).toLocaleString(),
          r.payment_method.toUpperCase(),
          String(r.items_count),
          Number(r.total || 0).toFixed(2)
        ]);
        break;
    }

    return res.json({ tenantId: currentTenantId, ...reportData });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return res.status(500).json({ error: 'Failed to generate report data' });
  }
};
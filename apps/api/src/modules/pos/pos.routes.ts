import { Router } from 'express';
import { db } from '../../db'; 
import * as schema from '../../db/schema';
import { sql } from 'drizzle-orm';

const router = Router();

router.post('/sales', async (req, res) => {
  const tenantId = parseInt(req.headers['x-tenant-id'] as string) || 1;
  const { receiptNumber, totalAmount, paymentMethod, items } = req.body;

  try {
    await db.transaction(async (tx) => {
      // 1. Create the main Sale record and capture its generated ID
      const [newSale] = await tx.insert(schema.sales).values({
        tenantId,
        branchId: 1,
        cashierId: 1,
        receiptNumber,
        subtotal: totalAmount.toString(),
        total: totalAmount.toString(),
        paymentStatus: 'completed'
      }).returning();

      const saleIdNum = Number(newSale.id);

      // 2. Insert Sale Items & Deduct Inventory Batches
      for (const item of items) {
        await tx.insert(schema.saleItems).values({
          saleId: saleIdNum,
          medicineId: item.medicineId,
          batchId: item.batchId,
          quantity: item.quantity,
          unitSellingPrice: item.unitPrice.toString(),
          subtotal: item.subtotal.toString(),
        });

        await tx.execute(
          sql`UPDATE medicine_batches 
              SET current_quantity = current_quantity - ${item.quantity} 
              WHERE id = ${item.batchId}`
        );
      }

      // 3. Record the Payment matching the strict schema properties only
      await tx.insert(schema.payments).values({
        saleId: saleIdNum,
        paymentMethod: paymentMethod,
        amount: totalAmount.toString(),
        status: 'completed'
      });
    });

    res.status(201).json({ success: true, message: 'Checkout successful' });
  } catch (error: any) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
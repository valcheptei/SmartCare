import { Router, Request, Response } from 'express';
import { db } from '../../db'; 
import * as schema from '../../db/schema';
import { sql, desc } from 'drizzle-orm';

const router = Router();

// GET all payments
router.get('/', async (req: Request, res: Response) => {
  try {
    const payments = await db.select()
      .from(schema.payments)
      .orderBy(desc(schema.payments.createdAt));

    return res.json(payments);
  } catch (error) {
    console.error('Database get error:', error);
    return res.json([]);
  }
});

// POST route using raw SQL matching the exact database columns
router.post('/', async (req: Request, res: Response) => {
  try {
    let { totalAmount, paymentMethod, status } = req.body;

    const finalStatus = status || 'completed';
    const finalMethod = paymentMethod || 'Cash';
    const finalAmount = Number(totalAmount) || 0;

    await db.execute(
      sql`INSERT INTO payments (sale_id, amount, payment_method, status) 
          VALUES (1, ${finalAmount.toString()}, ${finalMethod}, ${finalStatus})`
    );

    return res.status(201).json({ success: true, message: 'Payment recorded successfully' });
  } catch (error: any) {
    console.error('Insert payment error:', error);
    return res.status(500).json({ error: error.message || 'Failed to save payment' });
  }
});

export default router;
import { Request, Response } from 'express';
import { db } from '../../config/db';
import { paymentTransactions } from './payments.schema';
import { eq, desc } from 'drizzle-orm';

export async function getPayments(req: Request, res: Response) {
  try {
    const tenantId = parseInt(req.body.tenantId);
    const data = await db.select().from(paymentTransactions)
      .where(eq(paymentTransactions.tenantId, tenantId))
      .orderBy(desc(paymentTransactions.createdAt));
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function processPayment(req: Request, res: Response) {
  try {
    const tenantId = parseInt(req.body.tenantId);
    const payload = { ...req.body, tenantId };
    const newPayment = await db.insert(paymentTransactions).values(payload).returning();
    return res.status(201).json(newPayment[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
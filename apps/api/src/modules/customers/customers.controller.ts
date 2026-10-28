import { Request, Response } from 'express';
import { db } from '../../config/db';
import { customers } from './customers.schema';
import { eq } from 'drizzle-orm';

export async function getCustomers(req: Request, res: Response) {
  try {
    const tenantId = parseInt(req.body.tenantId);
    const data = await db.select().from(customers).where(eq(customers.tenantId, tenantId));
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function createCustomer(req: Request, res: Response) {
  try {
    const tenantId = parseInt(req.body.tenantId);
    const payload = { ...req.body, tenantId };
    const newCustomer = await db.insert(customers).values(payload).returning();
    return res.status(201).json(newCustomer[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
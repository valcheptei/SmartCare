import { Request, Response } from 'express';
import { db } from '../../config/db';
import { insuranceProviders } from './insurance.schema';
import { eq } from 'drizzle-orm';

export async function getProviders(req: Request, res: Response) {
  try {
    const tenantId = parseInt(req.body.tenantId);
    const data = await db.select().from(insuranceProviders).where(eq(insuranceProviders.tenantId, tenantId));
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function createProvider(req: Request, res: Response) {
  try {
    const tenantId = parseInt(req.body.tenantId);
    const payload = { ...req.body, tenantId };
    const newProvider = await db.insert(insuranceProviders).values(payload).returning();
    return res.status(201).json(newProvider[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
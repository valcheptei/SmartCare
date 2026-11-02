import { Request, Response } from 'express';
import { db } from '../../config/db';
import { medicineBatches } from './inventory.schema';
import { eq } from 'drizzle-orm';

export async function getBatches(req: Request, res: Response) {
  try {
    const tenantIdHeader = req.headers['x-tenant-id'];
    const tenantId = parseInt((tenantIdHeader as string) || req.body.tenantId || '1');

    const data = await db.select()
      .from(medicineBatches)
      .where(eq(medicineBatches.tenantId, tenantId));

    return res.status(200).json(data);
  } catch (error) {
    console.error('Get batches error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function createBatch(req: Request, res: Response) {
  try {
    const tenantIdHeader = req.headers['x-tenant-id'];
    const tenantId = parseInt((tenantIdHeader as string) || req.body.tenantId || '1');

    const payload = { ...req.body, tenantId };
    const newBatch = await db.insert(medicineBatches).values(payload).returning();
    
    return res.status(201).json(newBatch[0]);
  } catch (error) {
    console.error('Create batch error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
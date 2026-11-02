import { Request, Response } from 'express';
import { db } from '../../config/db';
import { medicines } from './medicines.schema';
import { eq, and } from 'drizzle-orm';

export async function getMedicines(req: Request, res: Response) {
  try {
    const tenantIdHeader = req.headers['x-tenant-id'];
    const tenantId = parseInt((tenantIdHeader as string) || req.body.tenantId || '1');
    
    // Fix: Safely normalize req.query.status whether it's a string, array, or undefined
    const rawStatus = req.query.status;
    const statusQuery: string = typeof rawStatus === 'string' 
      ? rawStatus 
      : Array.isArray(rawStatus) && typeof rawStatus[0] === 'string' 
        ? rawStatus[0] 
        : 'ACTIVE';

    const data = await db.select()
      .from(medicines)
      .where(
        and(
          eq(medicines.tenantId, tenantId),
          eq((medicines as any).status, statusQuery)
        )
      );

    return res.status(200).json(data);
  } catch (error) {
    console.error('Get medicines error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
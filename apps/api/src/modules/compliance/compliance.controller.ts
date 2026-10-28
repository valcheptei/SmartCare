import { Request, Response } from 'express';
import { db } from '../../config/db';
import { complianceEvents } from './compliance.schema';
import { eq, desc } from 'drizzle-orm';

export async function getComplianceEvents(req: Request, res: Response) {
  try {
    const tenantId = parseInt(req.body.tenantId);
    const data = await db.select().from(complianceEvents)
      .where(eq(complianceEvents.tenantId, tenantId))
      .orderBy(desc(complianceEvents.createdAt));
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
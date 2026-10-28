import { Request, Response } from 'express';
import { db } from '../../config/db';
import { auditLogs } from './audit.schema';
import { eq, desc } from 'drizzle-orm';

export async function getAuditLogs(req: Request, res: Response) {
  try {
    const tenantId = parseInt(req.body.tenantId);
    const data = await db.select().from(auditLogs)
      .where(eq(auditLogs.tenantId, tenantId))
      .orderBy(desc(auditLogs.createdAt));
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
import { Request, Response } from 'express';
import { db } from '../../config/db';
import { cashierShifts } from './shifts.schema';
import { eq, and } from 'drizzle-orm';

export async function getShifts(req: Request, res: Response) {
  try {
    const tenantId = parseInt(req.body.tenantId);
    const data = await db.select().from(cashierShifts).where(eq(cashierShifts.tenantId, tenantId));
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function startShift(req: Request, res: Response) {
  try {
    const tenantId = parseInt(req.body.tenantId);
    const payload = { ...req.body, tenantId };
    const newShift = await db.insert(cashierShifts).values(payload).returning();
    return res.status(201).json(newShift[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Added the generic <{ id: string }> to correctly type req.params.id for TypeScript
export async function endShift(req: Request<{ id: string }>, res: Response) {
  try {
    const tenantId = parseInt(req.body.tenantId);
    const shiftId = parseInt(req.params.id);
    const { closingCash } = req.body;

    const updatedShift = await db.update(cashierShifts)
      .set({
        endTime: new Date(),
        closingCash: closingCash.toString(),
        status: 'closed'
      })
      .where(and(eq(cashierShifts.id, shiftId), eq(cashierShifts.tenantId, tenantId)))
      .returning();

    return res.status(200).json(updatedShift[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
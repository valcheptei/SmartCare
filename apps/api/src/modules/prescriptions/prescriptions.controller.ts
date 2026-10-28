import { Request, Response } from 'express';
import { db } from '../../config/db';
import { prescriptions, prescriptionItems } from './prescriptions.schema';
import { eq } from 'drizzle-orm';

export async function getPrescriptions(req: Request, res: Response) {
  try {
    const tenantId = parseInt(req.body.tenantId);
    const data = await db.select().from(prescriptions).where(eq(prescriptions.tenantId, tenantId));
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function createPrescription(req: Request, res: Response) {
  try {
    const tenantId = parseInt(req.body.tenantId);
    const { patientId, prescriberName, facility, items } = req.body;
    
    const newPrescription = await db.insert(prescriptions).values({
      tenantId,
      patientId,
      prescriberName,
      facility
    }).returning();
    
    if (items && items.length > 0) {
      const pItemsData = items.map((item: any) => ({
        ...item,
        prescriptionId: newPrescription[0].id
      }));
      await db.insert(prescriptionItems).values(pItemsData);
    }
    
    return res.status(201).json(newPrescription[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
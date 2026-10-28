import { Request, Response } from 'express';
import { db } from '../../config/db';
import { sales, saleItems } from './pos.schema';
import { eq } from 'drizzle-orm';

export async function getSales(req: Request, res: Response) {
  try {
    const tenantId = parseInt(req.body.tenantId);
    const data = await db.select().from(sales).where(eq(sales.tenantId, tenantId));
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function createSale(req: Request, res: Response) {
  try {
    const tenantId = parseInt(req.body.tenantId);
    const { receiptNumber, totalAmount, paymentMethod, items } = req.body;
    
    const newSale = await db.insert(sales).values({
      tenantId,
      receiptNumber,
      totalAmount,
      paymentMethod
    }).returning();
    
    if (items && items.length > 0) {
      const saleItemsData = items.map((item: any) => ({
        ...item,
        saleId: newSale[0].id
      }));
      await db.insert(saleItems).values(saleItemsData);
    }
    
    return res.status(201).json(newSale[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    // If you are using Prisma, wrap it here:
    // const records = await prisma.modelName.findMany();
    // return res.json(records);

    // Temporary safe fallback until database tables are fully ready:
    return res.json([]);
  } catch (error) {
    console.error('Database error:', error);
    // CRITICAL: Always return 200 with an empty array on error so the frontend doesn't crash
    return res.json([]);
  }
});

export default router;
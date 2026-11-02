import { Router, Request, Response } from 'express';
import { login } from './auth.controller'; // Adjust path if your controller is named differently

const router = Router();

// Fallback GET route
router.get('/', async (req: Request, res: Response) => {
  try {
    return res.json([]);
  } catch (error) {
    console.error('Database error:', error);
    return res.json([]);
  }
});

// Secure Login POST route
router.post('/login', login);

export default router;
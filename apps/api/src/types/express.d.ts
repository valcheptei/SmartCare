import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // In a strict production environment, define the exact user object here
    }
  }
}
import { Request, Response } from 'express';
import { db } from '../../config/db';
import { users } from './auth.schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    
    // Strict input validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Strict password complexity regex check:
    // Minimum 8 chars, at least one uppercase, one lowercase, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        error: 'Security Policy Violation: Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.' 
      });
    }
    
    // Fetch user by email
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (user.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Secure password comparison using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user[0].passwordHash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.status(200).json({
      token: 'mock-jwt-session-token', // Replace with jsonwebtoken sign() in production
      user: {
        id: user[0].id,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        role: user[0].role,
        tenantId: user[0].tenantId
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
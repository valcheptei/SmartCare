import { db } from './config/db'; // Adjust path if needed
import { users } from './db/schema'; // Adjust path to your schema
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

async function setupAdmin() {
  try {
    const plainTextPassword = 'SmartCare@2026!';
    const hashedPassword = await bcrypt.hash(plainTextPassword, 10);
    
    await db.update(users)
      .set({ passwordHash: hashedPassword })
      .where(eq(users.email, 'admin@smartcare.co.ke'));
      
    console.log('✅ Admin password securely updated!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating password:', error);
    process.exit(1);
  }
}

setupAdmin();
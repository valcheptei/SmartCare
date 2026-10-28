import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as schema from './schema';

dotenv.config();
const db = drizzle(postgres(process.env.DATABASE_URL!, { ssl: 'require', prepare: false }), { schema });

async function addUser() {
  try {
    await db.insert(schema.users).values({
      id: 1,
      tenantId: 1,
      branchId: 1,
      name: 'Default Cashier',
      email: 'cashier@smartcare.com',
      passwordHash: 'hashed_password',
      role: 'cashier'
    } as any);
    console.log('✅ Cashier added successfully!');
  } catch (error) {
    console.error('❌ Failed to add cashier:', error);
  } finally {
    process.exit(0);
  }
}

addUser();
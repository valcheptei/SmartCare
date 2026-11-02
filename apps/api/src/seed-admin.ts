import { db } from './config/db'; 
import { users, tenants } from './db/schema'; 
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

async function seedAdmin() {
  try {
    // 1. Ensure a default tenant exists
    const existingTenants = await db.select().from(tenants).limit(1);
    let currentTenantId = 1;
    
    if (existingTenants.length === 0) {
       const newTenant = await db.insert(tenants).values({
         tradingName: 'SmartCare Main Branch',
         isActive: true
       }).returning();
       currentTenantId = newTenant[0].id;
       console.log('✅ Created default tenant.');
    } else {
       currentTenantId = existingTenants[0].id;
    }

    // 2. Hash the secure password
    const plainTextPassword = 'SmartCare@2026!';
    const hashedPassword = await bcrypt.hash(plainTextPassword, 10);
    
    // 3. Upsert admin user (Inserts if not exists, updates password if email already exists)
    await db.insert(users).values({
      tenantId: currentTenantId,
      name: 'System Admin',
      email: 'admin@smartcare.co.ke',
      passwordHash: hashedPassword,
      role: 'admin'
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        passwordHash: hashedPassword,
        name: 'System Admin',
        role: 'admin'
      }
    });

    console.log('✅ Admin user successfully seeded/updated!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seedAdmin();
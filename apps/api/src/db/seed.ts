import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as schema from './schema';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is missing.');

const client = postgres(connectionString, { ssl: 'require', prepare: false });
const db = drizzle(client, { schema });

async function seed() {
  console.log('🌱 Starting database seed with image catalog...');

  try {
    // 1. Create Default Tenant
    const [tenant] = await db.insert(schema.tenants).values({
      tradingName: 'SmartCare Pharmacy',
      kraPin: 'P051234567Z',
      ppbLicense: 'PPB/2026/001',
    } as any).returning();
    console.log(`✅ Tenant created: ${tenant.id}`);

    // 2. Create Default Branch
    const [branch] = await db.insert(schema.branches).values({
      tenantId: tenant.id,
      branchName: 'Main Branch (Nairobi)',
      location: 'Moi Avenue, CBD',
    } as any).returning();
    console.log(`✅ Branch created: ${branch.id}`);

    // 3. Create a Supplier
    const [supplier] = await db.insert(schema.suppliers).values({
      tenantId: tenant.id,
      companyName: 'Cosmos Pharmaceuticals Ltd',
      contactPerson: 'Supply Manager',
      phone: '+254712345678',
      email: 'sales@cosmos.co.ke'
    } as any).returning();
    console.log(`✅ Supplier created: ${supplier.id}`);

    // 4. Create Medicine Categories
    const categories = await db.insert(schema.medicineCategories).values([
      { tenantId: tenant.id, name: 'Antibiotics', description: 'Bacterial infection treatments' },
      { tenantId: tenant.id, name: 'Analgesics', description: 'Pain relievers and fever reducers' },
      { tenantId: tenant.id, name: 'Antihistamines', description: 'Allergy relief' },
      { tenantId: tenant.id, name: 'Gastrointestinal', description: 'Digestive system treatments' },
      { tenantId: tenant.id, name: 'Respiratory', description: 'Asthma and breathing aids' },
      { tenantId: tenant.id, name: 'Antidiabetic', description: 'Chronic blood sugar management' },
      { tenantId: tenant.id, name: 'Antimalarial', description: 'Malaria treatment' },
    ] as any[]).returning();
    
    const catId = (catName: string) => categories.find((c: any) => c.name === catName)!.id;
    console.log(`✅ Categories seeded.`);

    // 5. Seed Medicines with Image URLs mapping to public folder assets
    const medicinesData = [
      { categoryId: catId('Antibiotics'), medicineName: 'Amoxil', genericName: 'Amoxicillin', activeIngredients: 'Amoxicillin Trihydrate', prescriptionClass: 'POM', imageUrl: '/Amoxil.jpg' },
      { categoryId: catId('Analgesics'), medicineName: 'Aspirin', genericName: 'Acetylsalicylic acid', activeIngredients: 'Aspirin', prescriptionClass: 'OTC', imageUrl: '/Aspirin.jpg' },
      { categoryId: catId('Antibiotics'), medicineName: 'Augmentin', genericName: 'Amoxicillin/Clavulanate', activeIngredients: 'Amoxicillin, Clavulanate Potassium', prescriptionClass: 'POM', imageUrl: '/Augmentin.jpg' },
      { categoryId: catId('Analgesics'), medicineName: 'Brufen', genericName: 'Ibuprofen', activeIngredients: 'Ibuprofen', prescriptionClass: 'OTC', imageUrl: '/Brufen.jpg' },
      { categoryId: catId('Analgesics'), medicineName: 'Cataflam', genericName: 'Diclofenac Potassium', activeIngredients: 'Diclofenac', prescriptionClass: 'POM', imageUrl: '/Cataflam.jpg' },
      { categoryId: catId('Antihistamines'), medicineName: 'Cetirizine Syrup', genericName: 'Cetirizine Hydrochloride', activeIngredients: 'Cetirizine', prescriptionClass: 'OTC', imageUrl: '/Cetirizine Syrup.jpg' },
      { categoryId: catId('Gastrointestinal'), medicineName: 'Eno Fruit Salt', genericName: 'Sodium Bicarbonate/Citric Acid', activeIngredients: 'Sodium Bicarbonate, Citric Acid, Sodium Carbonate', prescriptionClass: 'OTC', imageUrl: '/Eno Fruit Salt.jpg' },
      { categoryId: catId('Antibiotics'), medicineName: 'Flagyl', genericName: 'Metronidazole', activeIngredients: 'Metronidazole', prescriptionClass: 'POM', imageUrl: '/Flagyl.jpg' },
      { categoryId: catId('Antidiabetic'), medicineName: 'Glucophage', genericName: 'Metformin', activeIngredients: 'Metformin Hydrochloride', prescriptionClass: 'POM', imageUrl: '/Glucophage.jpg' },
      { categoryId: catId('Antimalarial'), medicineName: 'Malarex', genericName: 'Artemether/Lumefantrine', activeIngredients: 'Artemether, Lumefantrine', prescriptionClass: 'POM', imageUrl: '/Malarex.jpg' },
      { categoryId: catId('Gastrointestinal'), medicineName: 'Omeprazole', genericName: 'Omeprazole', activeIngredients: 'Omeprazole', prescriptionClass: 'POM', imageUrl: '/Omeprazole.jpg' },
      { categoryId: catId('Analgesics'), medicineName: 'Panadol Advance', genericName: 'Paracetamol', activeIngredients: 'Paracetamol', prescriptionClass: 'OTC', imageUrl: '/Panadol Advance.jpg' },
      { categoryId: catId('Antihistamines'), medicineName: 'Piriton', genericName: 'Chlorpheniramine', activeIngredients: 'Chlorpheniramine Maleate', prescriptionClass: 'OTC', imageUrl: '/Piriton.jpg' },
      { categoryId: catId('Respiratory'), medicineName: 'Ventolin Inhaler', genericName: 'Salbutamol', activeIngredients: 'Salbutamol Sulfate', prescriptionClass: 'POM', imageUrl: '/Ventolin Inhaler.jpg' },
      { categoryId: catId('Antihistamines'), medicineName: 'Zyrtec', genericName: 'Cetirizine', activeIngredients: 'Cetirizine Hydrochloride', prescriptionClass: 'OTC', imageUrl: '/Zyrtec.jpg' }
    ];

    const medicines = await db.insert(schema.medicines).values(
      medicinesData.map(m => ({
        tenantId: tenant.id,
        isArchived: false,
        ...m
      } as any))
    ).returning();
    console.log(`✅ 15 Medicines catalog populated with images.`);

    // 6. Set Selling Prices
    const basePrices = ['300.00', '150.00', '1200.00', '250.00', '450.00', '350.00', '100.00', '200.00', '850.00', '750.00', '300.00', '120.00', '150.00', '650.00', '400.00'];
    
    await db.insert(schema.medicinePrices).values(
      medicines.map((med: any, index: number) => ({
        tenantId: tenant.id,
        medicineId: med.id,
        branchId: branch.id,
        unitSellingPrice: basePrices[index]
      } as any))
    );

    // 7. Receive Initial Inventory Batches
    const generateCost = (price: string) => (parseFloat(price) * 0.6).toFixed(2);

    await db.insert(schema.medicineBatches).values(
      medicines.map((med: any, index: number) => ({
        tenantId: tenant.id,
        medicineId: med.id,
        branchId: branch.id,
        supplierId: supplier.id,
        batchNumber: `BAT-${med.medicineName.substring(0, 3).toUpperCase()}-001`,
        initialQuantity: 150,
        currentQuantity: 150,
        purchaseCost: generateCost(basePrices[index]),
        manufacturingDate: '2026-05-01',
        receivedDate: new Date(),
        expiryDate: index % 3 === 0 ? '2026-12-01' : '2028-05-01',
        isQuarantined: false
      } as any))
    );
    console.log(`✅ Inventory batches received.`);

    console.log('🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
  } finally {
    process.exit(0);
  }
}

seed();
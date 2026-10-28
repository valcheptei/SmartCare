import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';

// Route Imports
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import authRoutes from './modules/auth/auth.routes';
import medicinesRoutes from './modules/medicines/medicines.routes';
import inventoryRoutes from './modules/inventory/inventory.routes';
import posRoutes from './modules/pos/pos.routes';
import prescriptionsRoutes from './modules/prescriptions/prescriptions.routes';
import purchasingRoutes from './modules/purchasing/purchasing.routes';
import insuranceRoutes from './modules/insurance/insurance.routes';
import shiftsRoutes from './modules/shifts/shifts.routes';
import reportsRoutes from './modules/reports/reports.routes';
import aiRoutes from './modules/ai/ai.routes';
import customersRoutes from './modules/customers/customers.routes';
import paymentsRoutes from './modules/payments/payments.routes';
import auditRoutes from './modules/audit/audit.routes';
import complianceRoutes from './modules/compliance/compliance.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import settingsRoutes from './modules/settings/settings.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Public routes (no tenant required)
app.use('/api/auth', authRoutes);
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'SmartCare POS API', timestamp: new Date() });
});

// Tenant-aware middleware (Safely handles GET/POST requests)
const requireTenant = (req: Request, res: Response, next: NextFunction) => {
  const tenantId = req.headers['x-tenant-id'];
  if (!tenantId) {
    return res.status(403).json({ error: 'Tenant context missing. Unauthorized access.' });
  }
  
  (req as any).tenantId = tenantId;
  if (req.body && typeof req.body === 'object') {
    req.body.tenantId = tenantId;
  }
  
  next();
};

// Protected routes mapped to all dashboard sidebar modules
app.use('/dashboard', dashboardRoutes);
app.use('/api/medicines', requireTenant, medicinesRoutes);
app.use('/api/inventory', requireTenant, inventoryRoutes);
app.use('/api/pos', requireTenant, posRoutes);
app.use('/api/prescriptions', requireTenant, prescriptionsRoutes);
app.use('/api/purchasing', requireTenant, purchasingRoutes);
app.use('/api/insurance', requireTenant, insuranceRoutes);
app.use('/api/shifts', requireTenant, shiftsRoutes);
app.use('/api/reports', requireTenant, reportsRoutes);
app.use('/api/ai', requireTenant, aiRoutes);
app.use('/api/customers', requireTenant, customersRoutes);
app.use('/api/payments', requireTenant, paymentsRoutes);
app.use('/api/audit', requireTenant, auditRoutes);
app.use('/api/compliance', requireTenant, complianceRoutes);
app.use('/api/analytics', requireTenant, analyticsRoutes);
app.use('/api/settings', requireTenant, settingsRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// START THE SERVER DIRECTLY
app.listen(PORT, () => {
  console.log(`SmartCare API running on http://localhost:${PORT}`);
});

export default app;
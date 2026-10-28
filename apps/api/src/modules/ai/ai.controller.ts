import { Request, Response } from 'express';

// In-memory mock database for AI recommendations
let recommendations = [
  {
    id: 1,
    tenantId: 1,
    medicineName: 'Amoxicillin 500mg Capsules',
    currentStock: 120,
    averageDailyConsumption: 18,
    forecastedDaysUntilStockout: 6,
    recommendedReorderQty: 500,
    suggestedSupplier: 'Cosmos Pharmaceuticals Ltd',
    expiryRiskLevel: 'LOW',
    confidenceScore: 94,
    status: 'PENDING_APPROVAL'
  },
  {
    id: 2,
    tenantId: 1,
    branchId: 1,
    medicineName: 'Metformin 850mg Tablets',
    currentStock: 45,
    averageDailyConsumption: 22,
    forecastedDaysUntilStockout: 2,
    recommendedReorderQty: 400,
    suggestedSupplier: 'Elys Chemical Industries Ltd',
    expiryRiskLevel: 'MEDIUM',
    confidenceScore: 91,
    status: 'PENDING_APPROVAL'
  },
  {
    id: 3,
    tenantId: 1,
    branchId: 1,
    medicineName: 'Omeprazole 20mg Capsules',
    currentStock: 310,
    averageDailyConsumption: 5,
    forecastedDaysUntilStockout: 62,
    recommendedReorderQty: 0,
    suggestedSupplier: 'MEDS',
    expiryRiskLevel: 'HIGH', // Slow-moving / near expiry risk
    confidenceScore: 88,
    status: 'REVIEWED'
  }
];

export const getAIRecommendationsHandler = async (req: Request, res: Response) => {
  try {
    const currentTenantId = parseInt(req.headers['x-tenant-id'] as string, 10);
    const tenantRecs = recommendations.filter(r => r.tenantId === currentTenantId);
    return res.json(tenantRecs);
  } catch (error) {
    console.error('Error fetching AI insights:', error);
    return res.status(500).json({ error: 'Failed to fetch AI forecasting data' });
  }
};

export const approveAIRecommendationHandler = async (req: Request, res: Response) => {
  try {
    const currentTenantId = parseInt(req.headers['x-tenant-id'] as string, 10);
    const recId = parseInt(req.params.id as string, 10);

    const recIndex = recommendations.findIndex(r => r.id === recId && r.tenantId === currentTenantId);
    if (recIndex === -1) {
      return res.status(404).json({ error: 'Recommendation not found.' });
    }

    // Human-in-the-loop governance approval update
    recommendations[recIndex] = {
      ...recommendations[recIndex],
      status: 'APPROVED_AND_DRAFTED'
    };

    return res.json({
      message: 'AI reorder recommendation successfully approved and converted into a Purchase Request.',
      recommendation: recommendations[recIndex]
    });
  } catch (error) {
    console.error('Error approving recommendation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
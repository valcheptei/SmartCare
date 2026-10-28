import { Router } from 'express';
import { getAIRecommendationsHandler, approveAIRecommendationHandler } from './ai.controller';

const router = Router();

router.get('/recommendations', getAIRecommendationsHandler);
router.post('/recommendations/:id/approve', approveAIRecommendationHandler);

export default router;
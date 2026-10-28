import { Router } from 'express';
import { getReportsHandler } from './reports.controller';

const router = Router();

router.get('/', getReportsHandler);

export default router;
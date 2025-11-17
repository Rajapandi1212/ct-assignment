import { Router } from 'express';
import { getProductTypes, getProject } from './project-controller';
import { formatResponse } from '../../utils/format-response';
const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const project = await getProject();
    return formatResponse({ req, res, statusCode: 200, data: project });
  } catch (error) {
    next(error);
  }
});

router.get('/productTypes', async (req, res, next) => {
  try {
    const productTypes = await getProductTypes();
    return formatResponse({ req, res, statusCode: 200, data: productTypes });
  } catch (error) {
    next(error);
  }
});

export default router;

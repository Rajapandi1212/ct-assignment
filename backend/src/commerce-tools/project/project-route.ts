import { Router } from 'express';
import { getProductTypes, getProject } from './project-controller';
import { formatResponse } from '../../utils/format-response';
const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const project = await getProject();
    return formatResponse(res, 200, project);
  } catch (error) {
    next(error);
  }
});

router.get('/productTypes', async (req, res, next) => {
  try {
    const productTypes = await getProductTypes();
    return formatResponse(res, 200, productTypes);
  } catch (error) {
    next(error);
  }
});

export default router;

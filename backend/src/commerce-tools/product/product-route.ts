import { Router } from 'express';
import { formatResponse } from '../../utils/format-response';
import { getProducts } from './product-controller';
const ProductRouter = Router();

ProductRouter.post('/', async (req, res, next) => {
  try {
    const project = await getProducts();
    return formatResponse({ res, statusCode: 200, data: project });
  } catch (error) {
    next(error);
  }
});

export default ProductRouter;

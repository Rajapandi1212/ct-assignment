import { Router } from 'express';
import { formatResponse } from '../../utils/format-response';
import { getProducts } from './product-controller';
import { getLocaleFromRequest } from '../../utils/get-locale-from-request';
const ProductRouter = Router();

ProductRouter.post('/', async (req, res, next) => {
  try {
    const locale = getLocaleFromRequest(req);
    const data = await getProducts(locale as string, req.body);
    return formatResponse({ res, statusCode: 200, data: data });
  } catch (error) {
    next(error);
  }
});

export default ProductRouter;

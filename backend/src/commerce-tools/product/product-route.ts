import { Router } from 'express';
import { formatResponse } from '../../utils/format-response';
import { getProducts, getProductBySku } from './product-controller';
import { getLocaleFromRequest } from '../../utils/get-locale-from-request';
const ProductRouter = Router();

ProductRouter.post('/', async (req, res, next) => {
  try {
    const locale = getLocaleFromRequest(req);
    const data = await getProducts(locale as string, req.body);
    return formatResponse({ req, res, statusCode: 200, data: data });
  } catch (error) {
    next(error);
  }
});

ProductRouter.get('/sku/:sku', async (req, res, next) => {
  try {
    const locale = getLocaleFromRequest(req);
    const { sku } = req.params;
    const data = await getProductBySku(sku, locale as string);

    if (!data) {
      return formatResponse({
        req,
        res,
        statusCode: 404,
        error: { message: `Product not found for sku : ${sku}` },
      });
    }

    return formatResponse({ req, res, statusCode: 200, data: data });
  } catch (error) {
    next(error);
  }
});

export default ProductRouter;

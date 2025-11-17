import { Router } from 'express';
import ProjectRouter from '../../commerce-tools/project/project-route';
import ProductRouter from '../../commerce-tools/product/product-route';
import CartRouter from '../../commerce-tools/cart/cart-routes';

const v1Routes = Router();

v1Routes.use('/project', ProjectRouter);
v1Routes.use('/products', ProductRouter);
v1Routes.use('/carts', CartRouter);

export default v1Routes;

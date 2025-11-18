import { Router } from 'express';
import ProjectRouter from '../../commerce-tools/project/project-route';
import ProductRouter from '../../commerce-tools/product/product-route';
import CartRouter from '../../commerce-tools/cart/cart-routes';
import CustomerRouter from '../../commerce-tools/customer/customer-routes';

const v1Routes = Router();

v1Routes.use('/project', ProjectRouter);
v1Routes.use('/products', ProductRouter);
v1Routes.use('/carts', CartRouter);
v1Routes.use('/customers', CustomerRouter);

export default v1Routes;

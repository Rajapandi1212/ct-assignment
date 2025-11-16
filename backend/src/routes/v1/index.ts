import { Router } from 'express';
import ProjectRouter from '../../commerce-tools/project/project-route';
import ProductRouter from '../../commerce-tools/product/product-route';

const v1Routes = Router();

v1Routes.use('/project', ProjectRouter);
v1Routes.use('/products', ProductRouter);

export default v1Routes;

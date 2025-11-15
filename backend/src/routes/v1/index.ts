import { Router } from 'express';
import ProjectRouter from '../../commerce-tools/project/project-route';

const v1Routes = Router();

v1Routes.use('/project', ProjectRouter);

export default v1Routes;

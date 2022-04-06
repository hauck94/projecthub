import { Request, Response, Router } from 'express';
import { Authentication } from '../middleware/authentication';
import { userRouter } from './user.router';
import { projectRouter } from './project.router';
import { widgetRouter } from './widget.router';

export const globalRouter = Router({ mergeParams: true });

globalRouter.get('/', (_: Request, res: Response) => {
  res.send({ message: 'Hello API' });
});

globalRouter.use('/users', userRouter);
globalRouter.use('/projects', Authentication.verifyAccess, projectRouter);
globalRouter.use('/widgets', Authentication.verifyAccess, widgetRouter);

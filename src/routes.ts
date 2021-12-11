import { Express, Request, Response } from 'express';
import { createUserHanlder } from './controller/user.controller';
import { validateRequest } from './middleware/validateRequest';
import { createUserSchema } from './schema/user.schema';

export const routes = (app: Express): void => {
  app.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200));

  // Register User
  // POST /api/user
  app.post('/api/users', validateRequest(createUserSchema), createUserHanlder);

  // Login User
  // POST /api/session

  // Get User's Session
  // GET /api/sessions

  // Logout
  // DELETE /api/sessions
};

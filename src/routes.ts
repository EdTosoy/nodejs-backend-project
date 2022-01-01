import { Express, Request, Response } from 'express';
import {
  createPostHandler,
  updatePostHandler,
  getPostHandler,
  deletePostHandler,
} from './controller/post.controller';
import {
  createUserSessionHandler,
  invalidateUserSessionHandler,
  getUserSessionsHandler,
} from './controller/session.controller';
import { createUserHanlder } from './controller/user.controller';
import { requiresUser, validateRequest } from './middleware';
import {
  createPostSchema,
  deletePostSchema,
  updatePostSchema,
} from './schema/post.schema';
import {
  createUserSchema,
  createUserSessionSchema,
} from './schema/user.schema';

export const routes = (app: Express): void => {
  app.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200));

  // Register User
  // POST /api/user
  app.post('/api/users', validateRequest(createUserSchema), createUserHanlder);

  // Login User
  // POST /api/session
  app.post(
    '/api/sessions',
    validateRequest(createUserSessionSchema),
    createUserSessionHandler
  );

  // Get User's Session
  // GET /api/sessions
  app.get('/api/sessions', requiresUser, getUserSessionsHandler);

  // Logout
  // DELETE /api/sessions
  app.delete('/api/sessions', requiresUser, invalidateUserSessionHandler);

  // Create
  app.post(
    '/api/posts',
    [requiresUser, validateRequest(createPostSchema)],
    createPostHandler
  );
  // Update a Post
  app.put(
    '/api/posts/:postId',
    [requiresUser, validateRequest(updatePostSchema)],
    updatePostHandler
  );
  // Get a post
  app.get('/api/posts/:postId', getPostHandler);
  // Delete a post
  app.delete(
    '/api/posts/:postId',
    [requiresUser, validateRequest(deletePostSchema)],
    deletePostHandler
  );
};

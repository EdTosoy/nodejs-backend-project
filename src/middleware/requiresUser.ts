import { get } from 'lodash';
import { Request, Response, NextFunction } from 'express';

export const requiresUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response<any, Record<string, any>>> => {
  const user = get(req, 'user');

  if (!user) {
    return res.sendStatus(403);
  }

  return next();
};

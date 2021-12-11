import { Request, Response, NextFunction } from 'express';
import { AnySchema } from 'yup';
import { log } from '../logger';

export const validateRequest =
  (schema: AnySchema) =>
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response<unknown, Record<string, unknown>>> => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      log.error(error);
      return res.status(400).send(error.errors);
    }
  };

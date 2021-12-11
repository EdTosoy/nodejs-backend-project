import { Request, Response } from 'express';
import { omit } from 'lodash';
import { log } from '../logger';
import { createUser } from '../service/user.service';

export const createUserHanlder = async (
  req: Request,
  res: Response
): Promise<Response<unknown, Record<string, unknown>>> => {
  try {
    const user = await createUser(req.body);
    return res.send(omit(user.toJSON(), 'password'));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    log.error(error);
    return res.status(409).send(error.message);
  }
};

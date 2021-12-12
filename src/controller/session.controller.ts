import config from 'config';
import { Response, Request } from 'express';
import { validatePassword } from '../service/user.service';
import { sign } from '../utils/jwt.utils';
import { createAccessToken, createSession } from '../service/session.service';

export const createUserSessionHandler = async (req: Request, res: Response) => {
  // validate the email and pasword
  const user = await validatePassword(req.body);

  if (!user) return res.status(401).send('Invalid Username or password');

  // create a session
  const session = await createSession(user._id, req.get('user-agent') || '');

  // create access token
  const accessToken = createAccessToken({
    user,
    session,
  });

  // create refresh token
  const refreshToken = sign(session, {
    expiresIn: config.get('refreshTokenTtl'),
  });

  // send refresh and access token back
  return res.send({ accessToken, refreshToken });
};

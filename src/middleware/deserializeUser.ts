import { get } from 'lodash';
import { Response, NextFunction } from 'express';
import { decode } from '../utils/jwt.utils';
import { reIssueAccessToken } from '../service/session.service';

export const deserializeUser = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const accessToken = get(req, 'headers.authorization', '').replace(
    /^Bearer\s/,
    ''
  );

  const refreshToken = get(req, 'headers.x-refresh');

  if (!accessToken) return next();

  const { decoded, expired } = decode(accessToken);

  if (decoded) {
    req.user = decoded;

    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });
    const decodedAccessToken = decode(accessToken);

    if (newAccessToken) {
      // Add the new access token to the response header
      res.setHeader('x-access-token', newAccessToken);

      req.user = decodedAccessToken;
    }

    return next();
  }

  return next();
};

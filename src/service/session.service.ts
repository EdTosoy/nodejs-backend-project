import { LeanDocument } from 'mongoose';
import config from 'config';
import { Session, SessionDocument } from '../model/session.model';
import { UserDocument } from '../model/user.model';
import { sign } from '../utils/jwt.utils';

interface IcreateAcessTokenParams {
  user:
    | Omit<UserDocument, 'password'>
    | LeanDocument<Omit<UserDocument, 'password'>>;
  session:
    | Omit<SessionDocument, 'password'>
    | LeanDocument<Omit<SessionDocument, 'password'>>;
}

export const createSession = async (
  userId: string,
  userAgent: string
): Promise<any> => {
  const session = await Session.create({ user: userId, userAgent });
  return session.toJSON();
};

export const createAccessToken = ({
  user,
  session,
}: IcreateAcessTokenParams): string => {
  // build and return the new access token
  const accessToken = sign(
    {
      ...user,
      session: session._id,
    },
    {
      expiresIn: config.get('accessTokenTtl'), // 15 minutes,
    }
  );
  return accessToken;
};

import { FilterQuery, LeanDocument, UpdateQuery } from 'mongoose';
import config from 'config';
import { get } from 'lodash';
import { Session, SessionDocument } from '../model/session.model';
import { UserDocument } from '../model/user.model';
import { decode, sign } from '../utils/jwt.utils';
import { findUser } from './user.service';

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

export const reIssueAccessToken = async ({
  refreshToken,
}: {
  refreshToken: string;
}): Promise<string | false> => {
  // Decode the refresh token
  const { decoded } = decode(refreshToken);

  if (!decoded || !get(decoded, '_id')) return false;

  // Get the session
  const session = await Session.findById(get(decoded, '_id'));

  // Make sure the session is still valid
  if (!session || !session?.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  const accessToken = createAccessToken({ user, session });

  return accessToken;
};

export const updateSession = async (
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) => Session.updateOne(query, update);

export const findSessions = async (query: FilterQuery<SessionDocument>) =>
  Session.find(query).lean();

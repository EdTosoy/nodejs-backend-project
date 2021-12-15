import config from 'config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

interface IDecodedToken {
  valid: boolean;
  expired: boolean;
  decoded: null | string | jwt.JwtPayload;
}

const privateKey = config.get('privateKey') as string;
export const sign = (
  object: Record<string, unknown>,
  options?: jwt.SignOptions | undefined
): string => jwt.sign(object, privateKey, options);

export const hashPassword = async (password: string): Promise<string> => {
  const salt = config.get('saltWorkFactor') as number;
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

export const decode = (token: string): IDecodedToken => {
  try {
    const decoded = jwt.verify(token, privateKey);

    return { valid: true, expired: false, decoded };
  } catch (error) {
    return {
      valid: false,
      expired: (error as Error).message === 'jwt expired',
      decoded: null,
    };
  }
};

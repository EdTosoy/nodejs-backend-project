import config from 'config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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

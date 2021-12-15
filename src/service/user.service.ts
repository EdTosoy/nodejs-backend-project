import { DocumentDefinition, FilterQuery, LeanDocument } from 'mongoose';
import { omit } from 'lodash';
import { User, UserDocument } from '../model/user.model';
import { hashPassword } from '../utils/jwt.utils';

export const createUser = async (
  input: DocumentDefinition<UserDocument>
): Promise<
  UserDocument & {
    _id: string;
  }
> => {
  try {
    const hashedPassword = await hashPassword(input.password);
    return await User.create({
      ...input,
      password: hashedPassword,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error);
  }
};

export const validatePassword = async ({
  email,
  password,
}: {
  email: UserDocument['email'];
  password: string;
}): Promise<any> => {
  const user = await User.findOne({ email });
  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    return false;
  }

  return omit(user.toJSON(), 'password');
};

export const findUser = async (
  query: FilterQuery<UserDocument>
): Promise<LeanDocument<
  UserDocument & {
    _id: any;
  }
> | null> => User.findOne(query).lean();

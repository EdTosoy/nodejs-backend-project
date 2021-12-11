import { DocumentDefinition } from 'mongoose';
import { User, UserDocument } from '../model/user.model';

export const createUser = async (
  input: DocumentDefinition<UserDocument>
): Promise<
  UserDocument & {
    _id: string;
  }
> => {
  try {
    return await User.create(input);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error);
  }
};

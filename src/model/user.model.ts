import mongoose, { Document } from 'mongoose';
import config from 'config';
import bcrypt from 'bcrypt';

export interface UserDocument extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async (next) => {
  const user = this as unknown as UserDocument;

  // only hash the password if it has been modified (or is new)
  if (!user?.isModified('password')) return next();

  // Random additional data
  const salt = await bcrypt.genSalt(config.get('saltWorkFactor'));

  const hash = await bcrypt.hashSync(user.password, salt);

  // Replace the password with the hash
  user.password = hash;

  return next();
});

// Used for logging in
UserSchema.methods.comparePassword = async (candidatePassword: string) => {
  const user = this as unknown as UserDocument;
  return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

export const User = mongoose.model<UserDocument>('User', UserSchema);

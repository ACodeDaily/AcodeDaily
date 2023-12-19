import { model, Schema, Document } from 'mongoose';
import { User } from '@/interfaces/user.interface';

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      private: true,
      select: false,
    },
    googleId: {
      type: String,
    },
    role: {
      type: String,
      enum: ['referrer', 'moderator', 'admin'],
      default: 'referrer',
    },
    organization: {
      type: String,
      default: 'none',
    },
  },
  { timestamps: true },
);

export const UserModel = model<User & Document>('User', UserSchema);

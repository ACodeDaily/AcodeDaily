import mongoose, { model, Schema, Document } from 'mongoose';
import { User } from '@/interfaces/user.interface';

const { ObjectId } = mongoose.Schema.Types;

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
      type: [String],
      enum: ['referrer', 'moderator', 'admin'],
      default: 'referrer',
    },
    org: {
      type: String,
      default: 'none',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: ObjectId,
      ref: 'User',
    },
    totalReferred: {
      type: Number,
      default: 0,
    },
    activities: {
      type: [ObjectId],
      ref: 'Activity',
      default: [],
    },
  },
  { timestamps: true },
);

export const UserModel = model<User & Document>('User', UserSchema);

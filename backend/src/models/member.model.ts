import { Schema, model, Document } from 'mongoose';
import { Member } from '@interfaces/member.interface';
const { ObjectId } = Schema.Types;

const memberSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    cfUserName: {
      type: String,
      required: true,
      unique: true,
    },
    jobId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    resume: {
      type: String,
      required: true,
      match: /^https:\/\/drive\.google\.com\//, // Match Google Drive link prefix
    },
    org: {
      type: String,
      required: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
    },
    cgpa: {
      type: Number,
      required: true,
    },
    yoe: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
      lowercase: true,
    },
    referrerResponse: {
      type: String,
    },
    activities: {
      type: [ObjectId],
      ref: 'Activity',
      default: [],
    },
    secretId: {
      type: ObjectId,
      ref: 'Secret',
    },
  },
  {
    timestamps: true,
  },
);

export const MemberModel = model<Member & Document>('Member', memberSchema);

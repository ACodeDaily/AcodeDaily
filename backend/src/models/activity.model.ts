import { model, Schema, Document } from 'mongoose';
import { Activity } from '@/interfaces/activity.interface';

const ActivitySchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    cfUserName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    referrerResponse: {
      type: String,
    },
    jobId: {
      type: String,
      required: true,
    },
    responseDate: {
      type: Date,
      default: Date.now,
    },
    applicationDate: {
      type: Date,
      required: true,
    },
    referrerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const ActivityModel = model<Activity & Document>('Activity', ActivitySchema);

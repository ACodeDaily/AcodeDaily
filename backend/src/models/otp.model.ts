import { model, Schema, Document } from 'mongoose';
import { Otp } from '@interfaces/otp.interface';

const OtpSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    expiresIn: {
      type: String,
      required: true,
    },
    attempts: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
);

export const OtpModel = model<Otp & Document>('Otp', OtpSchema);

import { Schema, model, Document } from 'mongoose';
import { Secret } from '@interfaces/secret.interface';

const secretSchema: Schema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    cfUserName: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Map,
      of: Number,
      required: true,
    },
    tokenIssuedAt: {
      type: Date,
      default: Date.now,
    },
    discordId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

secretSchema.index({ cfUserName: 1, token: 1 }, { unique: true });

export const SecretModel = model<Secret & Document>('Secret', secretSchema);

import { model, Schema } from "mongoose";

export interface INonce {
  chain_id: number;
  count: number;
  created_at: Date;
  updated_at: Date;
}

const nonceSchema = new Schema(
  {
    chain_id: { type: Number, unique: true },
    count: Number
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Nonce = model<INonce>('Nonce', nonceSchema)

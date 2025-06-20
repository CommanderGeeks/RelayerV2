import { model, Schema } from "mongoose";

export interface IGlobal {
  chain_id: number;
  processing: boolean;
  last_processed_block: number;
  created_at: Date;
  updated_at: Date;
}

const globalSchema = new Schema(
  {
    chain_id: { type: Number, unique: true },
    last_processed_block: Number,
    processing: Boolean
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Global = model<IGlobal>('Global', globalSchema)

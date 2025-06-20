import { model, Schema } from "mongoose";
import { EState } from "./types";

export interface ITransaction {
  amountIn: number;
  amountOut: number;
  created_at: Date;
  fee: number;
  from_chain_id: number;
  to_chain_id: number;
  input_token: string;
  input_token_decimals: number;
  output_token: string;
  output_token_decimals: number;
  input_hash: string;
  input_block_number: number;
  output_hash: string;
  payout_block_number: number;
  sender: string;
  receiver: string;
  state: EState;
  bridge_data_hash: string;
  updated_at: Date;
  notified: boolean;
}

const transactionSchema = new Schema<ITransaction>(
  {
    amountIn: Number,
    amountOut: Number,
    fee: Number,
    from_chain_id: Number,
    to_chain_id: Number,
    input_token: String,
    input_token_decimals: Number,
    output_token: String,
    output_token_decimals: Number,
    input_hash: { type: String, unique: true },
    output_hash: String, // should not be unique because null will be a duplicate
    input_block_number: Number,
    payout_block_number: Number,
    sender: String,
    receiver: String,
    state: { type: String, enum: EState },
    bridge_data_hash: String,
    notified: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);

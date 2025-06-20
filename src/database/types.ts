export enum EState {
  validating = "validating",
  processing = "processing",
  released = "released",
  failed = "failed",
}

export interface ITxData {
  amountIn: number;
  amountOut: number;
  fee: number;
  from_chain_id: number;
  to_chain_id: number;
  input_token: string;
  input_token_decimals: number;
  output_token: string;
  output_token_decimals: number;
  input_hash: string;
  input_block_number: number;
  output_hash?: string;
  payout_block_number?: number;
  sender: string;
  receiver: string;
  state: EState;
  bridge_data_hash: string;
}

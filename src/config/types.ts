export interface IToken {
  key: string;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  diffDecimals?: boolean;
  nativeCoin?: boolean;
}

export interface ITokenSolana extends IToken {
  minTx: number;
  maxTx: number;
  isMintable: boolean;
  isActive: boolean;
}

export interface IChain {
  isActive: boolean;
  chainId: number;
  name: string;
  rpc: string;
  portalAddress: string;
  explorer: string;
  startBlock: number;
  requiredBlocks: number;
  rpcBlockLimit: number;
  tokens: IToken[];
}

export interface IBridgeData {
  sender: string;
  receiver: string;
  inputTokenAddress: string;
  amount: number;
  fee: number;
  toChainId: number;
  inputTxHash: string;
  inputBlockNumber: number;
}
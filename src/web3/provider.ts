import Web3 from "web3";
import { IChain } from "../config/types";
import chainList from "../config/chains";

export const web3ByChainId = (chainId: number) => {
  const chain = chainList.find((chain) => Number(chain.chainId) === Number(chainId));
  if (chain === undefined)
    throw new Error(`Chain with id:${chainId} not found!!!`);

  return new Web3(chain.rpc);
};

export const web3ByChain = (chain: IChain) => {
  return new Web3(chain.rpc);
};
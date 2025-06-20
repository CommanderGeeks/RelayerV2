import chainList from "../config/chains";
import { IChain, IToken } from "../config/types";
import { Address } from "./address";

export const getToken = (
  address: string,
  chainId: number
): IToken | undefined => {
  const chain = getChain(chainId);
  if (!chain) return undefined;
  return chain.tokens.find((t) => Address(address) === Address(t.address));
};

export const getTokenByKey = (
  tokenKey: string,
  chainId: number
): IToken | undefined => {
  const chain = getChain(chainId);
  if (!chain) return undefined;
  return chain.tokens.find(
    (t) => t.key.toLowerCase() === tokenKey.toLowerCase()
  );
};

export const getChain = (chainId: number): IChain | undefined => {
  return chainList.find((c) => Number(chainId) === Number(c.chainId));
};

export const getChainName = (chainId: number): string | undefined => {
  return getChain(chainId)?.name;
};

export const formatMoney = (amount: string) => {
  return new Intl.NumberFormat("en-US").format(Number(amount));
};

import BigNumber from "bignumber.js";

export const to10Pow = (value: any, decimals: number = 18): BigNumber => {
  return new BigNumber(value).times(10 ** decimals);
};

export const from10Pow = (value: any, decimals: number = 18): BigNumber => {
  return new BigNumber(value).div(10 ** decimals);
};
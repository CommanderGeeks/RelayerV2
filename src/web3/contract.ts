import { AbiItem } from "web3-utils";
import portalAbi from "./abi/WizPortal.json";
import wizErc20Abi from "./abi/WizErc20.json";

export const getPortalContract = (web3: any, address: string) => {
  return new web3.eth.Contract(portalAbi as AbiItem[], address);
};

export const getTokenContract = (web3: any, address: string) => {
  return new web3.eth.Contract(wizErc20Abi as AbiItem[], address);
};
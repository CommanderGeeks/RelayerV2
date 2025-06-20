import { ADDRESS_ZERO } from "../config";

export const Address = (address: string): string => {
  return address?.toLowerCase() || ADDRESS_ZERO;
};

export const compareAddress = (address1: string, address2: string): boolean => {
  return address1.toLowerCase() === address2.toLowerCase();
};

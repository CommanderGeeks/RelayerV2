import { ITokenSolana } from "../types";

const tokens: ITokenSolana[] = [

  {
    key: "Shaman",
    address: "5YnjBp1eidhx7MhATU6hPwg8PtE72vx2ApC2sjXApump", // EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
    name: "Shaman",
    symbol: "Shaman",
    decimals: 6,
    minTx: 1,
    maxTx: 25000000,
    isMintable: false,
    isActive: true,
  },

  {
    key: "Infinaeon",
    address: "42py4U4kUcxUsj2AYAbPuu9ottwYM2Y9P8jo3fHiNF42", // EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
    name: "Infinaeon",
    symbol: "Infinaeon",
    decimals: 9,
    minTx: 1000,
    maxTx: 1000000,
    isMintable: false,
    isActive: true,
  },

  {
    key: "Yafa",
    address: "YAFAJvjUv9MVAKcTE7Y8ouo45QNKVK6fCMzdxt2tjPs", // EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
    name: "Yafa",
    symbol: "Yafa",
    decimals: 9,
    minTx: 1,
    maxTx: 1000000,
    isMintable: false,
    isActive: true,
  },

  

];

export default tokens;
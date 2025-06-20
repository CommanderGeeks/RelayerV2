// src/config/chains.ts
import { IChain } from "./types";
import bscTokens from "./tokens/bsc";
import baseTokens from "./tokens/base";
import solanaTokens from "./tokens/solana";
import ethTokens from "./tokens/eth";
import infTokens from "./tokens/inf";
import { SOLANA_CHAIN_ID } from "./solana";

// Load environment variables for RPC URLs
const BSC_RPC_URL = process.env.BSC_RPC_URL || "https://bsc-dataseed.binance.org/";
const BASE_RPC_URL = process.env.BASE_RPC_URL || "https://mainnet.base.org";
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
const INF_RPC_URL = process.env.INF_RPC_URL || "https://rpc.infinaeon.com";

//RPC IS VERRY VERRRYYYYYY IMPORTANT, MAKE SURE ITS POINTING TO RIGHT CHAIN EVEN IF QUICKNODE SAYS MULTI-CHAIN

const chainList: IChain[] = [
  {
    isActive: true,
    chainId: SOLANA_CHAIN_ID,
    name: "Solana",
    rpc: SOLANA_RPC_URL,
    portalAddress: "qLbS4ESAAgJPUVFn6Jiu7HGEPEPT7ZrxPLu9DLJsGoE",
    explorer: "https://solscan.io/",
    startBlock: 347987964,
    requiredBlocks: 10,
    rpcBlockLimit: 1000,
    tokens: solanaTokens,
  },

  {
    isActive: true,
    chainId: 56,
    name: "Binance Smart Chain",
    rpc: BSC_RPC_URL,
    portalAddress: "0xbfE84444E331D45E3E5666E353830657D5a07935",
    explorer: "https://bscscan.com",
    startBlock: 46753424,
    requiredBlocks: 10,
    rpcBlockLimit: 50,
    tokens: bscTokens,
  }, 
  {
    isActive: true,
    chainId: 8453,
    name: "Base",
    rpc: BASE_RPC_URL,
    portalAddress: "0x48E3b1C1403E3006ec6F70bE75d1aa72288814f6",
    explorer: "https://basescan.org",
    startBlock: 26526187,
    requiredBlocks: 15,
    rpcBlockLimit: 50,
    tokens: baseTokens,
  },
  {
    isActive: true,
    chainId: 1,
    name: "Eth",
    rpc: ETH_RPC_URL,
    portalAddress: "0x13e65B7C2066926aC90E6b09831cF460F9ee16E8",
    explorer: "https://etherscan.io",
    startBlock: 21075968,
    requiredBlocks: 3,
    rpcBlockLimit: 15,
    tokens: ethTokens,
  },

  {
    isActive: true,
    chainId: 420000,
    name: "Infinaeon",
    rpc: INF_RPC_URL,
    portalAddress: "0x262F5D28087Bda51e3AcB2949B50f0ADd871A78f",
    explorer: "https://explorer.infinaeon.com",
    startBlock: 2109000,
    requiredBlocks: 15,
    rpcBlockLimit: 50,
    tokens: infTokens,
  },
];

export default chainList;
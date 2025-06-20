import { IToken } from "./types";
require("dotenv").config();

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const RELAYER_ADDRESS = process.env.RELAYER_ADDRESS!;
export const RELAYER_KEY = process.env.RELAYER_KEY!;
export const CRON_SCHEDULE = process.env.CRON_SCHEDULE || "*/5 * * * *";
export const DEV_CHATID = process.env.DEV_CHATID!;
export const ERROR_CHATID = process.env.ERROR_CHATID!;
export const BOT_TOKEN = process.env.BOT_TOKEN!;
export const ERROR_BOT_TOKEN = process.env.ERROR_BOT_TOKEN!;
export const HASH_SECRET = process.env.HASH_SECRET!;
export const BIRDEYE_API_KEY = process.env.BIRDEYE_API_KEY!;
export const DEPOSIT_KECCAK = process.env.DEPOSIT_KECCAK!;

export const dummyToken: IToken = {
  key: "INVALID",
  address: "0x0000000000000000000000000000000000000000",
  name: "INVALID",
  symbol: "INVALID",
  decimals: 6,
};

export const PADDED_DECIMALS = 10**18;

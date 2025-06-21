"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PADDED_DECIMALS = exports.dummyToken = exports.DEPOSIT_KECCAK = exports.BIRDEYE_API_KEY = exports.HASH_SECRET = exports.ERROR_BOT_TOKEN = exports.BOT_TOKEN = exports.ERROR_CHATID = exports.DEV_CHATID = exports.CRON_SCHEDULE = exports.RELAYER_KEY = exports.RELAYER_ADDRESS = exports.ADDRESS_ZERO = void 0;
require("dotenv").config();
exports.ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
exports.RELAYER_ADDRESS = process.env.RELAYER_ADDRESS;
exports.RELAYER_KEY = process.env.RELAYER_KEY;
exports.CRON_SCHEDULE = process.env.CRON_SCHEDULE || "*/5 * * * *";
exports.DEV_CHATID = process.env.DEV_CHATID;
exports.ERROR_CHATID = process.env.ERROR_CHATID;
exports.BOT_TOKEN = process.env.BOT_TOKEN;
exports.ERROR_BOT_TOKEN = process.env.ERROR_BOT_TOKEN;
exports.HASH_SECRET = process.env.HASH_SECRET;
exports.BIRDEYE_API_KEY = process.env.BIRDEYE_API_KEY;
exports.DEPOSIT_KECCAK = process.env.DEPOSIT_KECCAK;
exports.dummyToken = {
    key: "INVALID",
    address: "0x0000000000000000000000000000000000000000",
    name: "INVALID",
    symbol: "INVALID",
    decimals: 6,
};
exports.PADDED_DECIMALS = 10 ** 18;

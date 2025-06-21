"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const chains_1 = __importDefault(require("./config/chains"));
const wrapper_1 = require("./database/wrapper");
const processDeposits_1 = __importDefault(require("./process/processDeposits"));
const connect_1 = require("./database/connect");
const config_1 = require("./config");
const processPayouts_1 = __importDefault(require("./process/processPayouts"));
const validateDeposits_1 = __importDefault(require("./process/validateDeposits"));
const utils_1 = require("./helpers/utils");
const processSolDeposit_1 = __importDefault(require("./process/solana/processSolDeposit"));
const validateSolDeposits_1 = __importDefault(require("./process/solana/validateSolDeposits"));
const processSolPayouts_1 = __importDefault(require("./process/solana/processSolPayouts"));
const solana_1 = require("./config/solana");
const { schedule } = require("node-cron");
const WORKER_ID = 1001;
(async () => {
    try {
        await (0, connect_1.connectMongoose)();
        // reset worker
        await (0, wrapper_1.updateWorker)(WORKER_ID, false);
        for (let index = 0; index < chains_1.default.length; index++) {
            const chain = chains_1.default[index];
            await (0, wrapper_1.updateWorker)(chain.chainId, false);
        }
        console.log("Mongodb connected!!!");
    }
    catch (error) {
        (0, utils_1.logError)(`Initialization failed: ${error}`);
    }
})();
schedule(config_1.CRON_SCHEDULE, async () => {
    try {
        const worker = await (0, wrapper_1.getWorker)(WORKER_ID);
        if (worker)
            return;
        await (0, wrapper_1.updateWorker)(WORKER_ID, true);
        // Validate Sol Deposits and Process Payouts
        await (0, processSolDeposit_1.default)(solana_1.SOLANA_CHAIN_ID);
        await (0, validateSolDeposits_1.default)(solana_1.SOLANA_CHAIN_ID);
        await (0, processSolPayouts_1.default)(solana_1.SOLANA_CHAIN_ID);
        for (let index = 0; index < chains_1.default.length; index++) {
            const chain = chains_1.default[index];
            // skip solana chain
            if (chain.chainId === solana_1.SOLANA_CHAIN_ID)
                continue;
            await (0, processDeposits_1.default)(chain.chainId);
            await (0, validateDeposits_1.default)(chain.chainId);
            await (0, processPayouts_1.default)(chain.chainId);
        }
        await (0, wrapper_1.updateWorker)(WORKER_ID, false);
    }
    catch (error) {
        (0, utils_1.logError)(error);
    }
    finally {
        await (0, wrapper_1.updateWorker)(WORKER_ID, false);
    }
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snapshot = void 0;
const wrapper_1 = require("../database/wrapper");
const config_1 = require("./config");
const callSnapshot = async (chainId) => {
    await (0, wrapper_1.updateWorker)(chainId, true);
    const chain = config_1.config.find((c) => c.chainId === chainId);
    if (!chain)
        throw new Error("Invalid chain id");
    const snapshotBlock = chain.snapshotBlock;
    await (0, wrapper_1.createOrUpdateGlobal)(Number(chainId), snapshotBlock);
    await (0, wrapper_1.updateWorker)(chainId, false);
    console.log(`Snapshot block ${snapshotBlock} for chain ${chainId} created`);
};
const snapshot = async () => {
    config_1.config.forEach(async (chain) => {
        await callSnapshot(chain.chainId);
    });
};
exports.snapshot = snapshot;

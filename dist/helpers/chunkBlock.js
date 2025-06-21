"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunkBlocks = void 0;
const chunkBlocks = (latestBlock, lastBlock, defaultChunk) => {
    const diff = parseInt(latestBlock) - parseInt(lastBlock);
    // if (diff > 15000) return 15000;
    // if (diff > 12000) return 12000;
    if (diff > 10000)
        return 10000;
    if (diff > 5000)
        return 5000;
    if (diff > 2000)
        return 2000;
    if (diff > 1000)
        return 1000;
    if (diff > 700)
        return 700;
    if (diff > 500)
        return 500;
    if (diff > 350)
        return 350;
    if (diff > 300)
        return 300;
    if (diff > 250)
        return 250;
    if (diff > 200)
        return 200;
    if (diff > 150)
        return 150;
    if (diff > 100)
        return 100;
    return parseInt(defaultChunk);
};
exports.chunkBlocks = chunkBlocks;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unFreezeTx = exports.freezeTx = exports.getTxByHash = exports.getFailedTxs = exports.findTxs = exports.getTxs = exports.updateTx = exports.saveTx = exports.getWorker = exports.updateWorker = exports.createOrUpdateGlobal = exports.getLastBlock = exports.updateNonce = exports.createNonce = exports.getNonce = void 0;
const transaction_model_1 = require("./transaction.model");
const nonce_model_1 = require("./nonce.model");
const global_model_1 = require("./global.model");
const getNonce = async (chainId) => {
    const doc = await nonce_model_1.Nonce.findOne({ chain_id: chainId });
    if (!doc)
        return null;
    return doc.count;
};
exports.getNonce = getNonce;
const createNonce = async (chainId, count) => {
    await nonce_model_1.Nonce.create({ chain_id: chainId, count });
};
exports.createNonce = createNonce;
const updateNonce = async (chainId, count) => {
    return nonce_model_1.Nonce.findOneAndUpdate({ chain_id: chainId }, { count }, { returnOriginal: false });
};
exports.updateNonce = updateNonce;
const getLastBlock = async (chainId) => {
    const doc = await global_model_1.Global.findOne({ chain_id: chainId });
    if (!doc)
        return null;
    return doc.last_processed_block;
};
exports.getLastBlock = getLastBlock;
const createOrUpdateGlobal = async (chainId, blockNumber) => {
    const doc = await global_model_1.Global.findOne({ chain_id: chainId });
    if (doc) {
        return global_model_1.Global.findOneAndUpdate({ chain_id: chainId }, { last_processed_block: blockNumber }, { returnOriginal: false });
    }
    return await global_model_1.Global.create({
        chain_id: chainId,
        last_processed_block: blockNumber,
    });
};
exports.createOrUpdateGlobal = createOrUpdateGlobal;
const updateWorker = async (chainId, working) => {
    const doc = await global_model_1.Global.findOne({ chain_id: chainId });
    if (doc) {
        return global_model_1.Global.findOneAndUpdate({ chain_id: chainId }, { processing: working }, { returnOriginal: false });
    }
    return await global_model_1.Global.create({ chain_id: chainId, processing: working });
};
exports.updateWorker = updateWorker;
const getWorker = async (chainId) => {
    const doc = await global_model_1.Global.findOne({ chain_id: chainId });
    if (!doc)
        return null;
    return doc.processing;
};
exports.getWorker = getWorker;
const saveTx = async (data) => {
    await transaction_model_1.Transaction.create(data);
};
exports.saveTx = saveTx;
const updateTx = async (input_hash, data = {}) => {
    return transaction_model_1.Transaction.findOneAndUpdate({ input_hash }, data, {
        returnOriginal: false,
    });
};
exports.updateTx = updateTx;
const getTxs = async () => {
    return transaction_model_1.Transaction.find();
};
exports.getTxs = getTxs;
const findTxs = async (data) => {
    return transaction_model_1.Transaction.find(data).sort({ input_block_number: 1 }).limit(10);
};
exports.findTxs = findTxs;
const getFailedTxs = async () => {
    return transaction_model_1.Transaction.find({ output_hash: null });
};
exports.getFailedTxs = getFailedTxs;
const getTxByHash = async (hash) => {
    return transaction_model_1.Transaction.findOne({ input_hash: hash });
};
exports.getTxByHash = getTxByHash;
const freezeTx = async (input_hash) => {
    return transaction_model_1.Transaction.findOneAndUpdate({ input_hash }, { freeze: true }, {
        returnOriginal: false,
    });
};
exports.freezeTx = freezeTx;
const unFreezeTx = async (input_hash) => {
    return transaction_model_1.Transaction.findOneAndUpdate({ input_hash }, { freeze: false }, {
        returnOriginal: false,
    });
};
exports.unFreezeTx = unFreezeTx;

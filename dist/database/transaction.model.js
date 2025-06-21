"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const types_1 = require("./types");
const transactionSchema = new mongoose_1.Schema({
    amountIn: Number,
    amountOut: Number,
    fee: Number,
    from_chain_id: Number,
    to_chain_id: Number,
    input_token: String,
    input_token_decimals: Number,
    output_token: String,
    output_token_decimals: Number,
    input_hash: { type: String, unique: true },
    output_hash: String,
    input_block_number: Number,
    payout_block_number: Number,
    sender: String,
    receiver: String,
    state: { type: String, enum: types_1.EState },
    bridge_data_hash: String,
    notified: { type: Boolean, default: false },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);

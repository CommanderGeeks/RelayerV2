"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Global = void 0;
const mongoose_1 = require("mongoose");
const globalSchema = new mongoose_1.Schema({
    chain_id: { type: Number, unique: true },
    last_processed_block: Number,
    processing: Boolean
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });
exports.Global = (0, mongoose_1.model)('Global', globalSchema);

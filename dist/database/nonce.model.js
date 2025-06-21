"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nonce = void 0;
const mongoose_1 = require("mongoose");
const nonceSchema = new mongoose_1.Schema({
    chain_id: { type: Number, unique: true },
    count: Number
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });
exports.Nonce = (0, mongoose_1.model)('Nonce', nonceSchema);

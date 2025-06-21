"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongoose = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { MONGODB_URI } = process.env;
const connectMongoose = async () => {
    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is missing");
    }
    return await mongoose_1.default.connect(MONGODB_URI);
};
exports.connectMongoose = connectMongoose;

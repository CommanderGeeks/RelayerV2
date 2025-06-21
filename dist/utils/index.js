"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.from10Pow = exports.to10Pow = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const to10Pow = (value, decimals = 18) => {
    return new bignumber_js_1.default(value).times(10 ** decimals);
};
exports.to10Pow = to10Pow;
const from10Pow = (value, decimals = 18) => {
    return new bignumber_js_1.default(value).div(10 ** decimals);
};
exports.from10Pow = from10Pow;

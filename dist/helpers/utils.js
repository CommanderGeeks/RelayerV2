"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = exports.formatMoney = void 0;
const fs = __importStar(require("fs"));
const notifyDevErr_1 = __importDefault(require("../bot/messages/notifyDevErr"));
const formatMoney = (num) => {
    return num.toLocaleString();
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    })
        .format(num)
        .replace("$", "");
};
exports.formatMoney = formatMoney;
const logError = (msg) => {
    try {
        const time = new Date(Date.now()).toTimeString();
        const dateTime = time.split(" ")[0] +
            " " +
            new Date(Date.now()).toDateString() +
            " " +
            time.split(" ")[1];
        const todayErrorFile = `logs/${new Date(Date.now())
            .toDateString()
            .replace(/ /gi, "-")}.log`;
        fs.appendFileSync(todayErrorFile, time + " \n");
        fs.appendFileSync(todayErrorFile, msg.toString());
        fs.appendFileSync(todayErrorFile, "\n \n");
        console.log(`\x1b[31m${dateTime}\x1b[0m`);
        console.log(`\x1b[31m${msg.toString()}\x1b[0m`);
        (0, notifyDevErr_1.default)(msg);
    }
    catch (error) {
        console.error("Error writing to log file:", error);
    }
};
exports.logError = logError;

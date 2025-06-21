"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenContract = exports.getPortalContract = void 0;
const WizPortal_json_1 = __importDefault(require("./abi/WizPortal.json"));
const WizErc20_json_1 = __importDefault(require("./abi/WizErc20.json"));
const getPortalContract = (web3, address) => {
    return new web3.eth.Contract(WizPortal_json_1.default, address);
};
exports.getPortalContract = getPortalContract;
const getTokenContract = (web3, address) => {
    return new web3.eth.Contract(WizErc20_json_1.default, address);
};
exports.getTokenContract = getTokenContract;

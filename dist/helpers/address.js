"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareAddress = exports.Address = void 0;
const config_1 = require("../config");
const Address = (address) => {
    return address?.toLowerCase() || config_1.ADDRESS_ZERO;
};
exports.Address = Address;
const compareAddress = (address1, address2) => {
    return address1.toLowerCase() === address2.toLowerCase();
};
exports.compareAddress = compareAddress;

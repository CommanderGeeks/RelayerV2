"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const notifyDevErr = async (error) => {
    try {
        const data = {
            message: error
                .toString()
                .replace(/_/gi, "\\_")
                .replace(/-/gi, "\\-")
                .replace("~", "\\~")
                .replace(/`/gi, "\\`")
                .replace(/\*/gi, "\\*")
                .replace(/\+/gi, "\\+")
                .replace(/\./g, "\\."),
        };
        await (0, __1.sendErrorMessage)("error", data);
    }
    catch (error) {
        console.log(error);
    }
};
exports.default = notifyDevErr;

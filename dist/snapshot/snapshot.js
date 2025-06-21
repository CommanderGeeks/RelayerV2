"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const connect_1 = require("../database/connect");
const utils_1 = require("../helpers/utils");
const index_1 = require("./index");
(async () => {
    try {
        await (0, connect_1.connectMongoose)();
        console.log("Mongodb connected!!!");
        (0, index_1.snapshot)();
    }
    catch (error) {
        (0, utils_1.logError)(`Snapshot initialization failed: ${error}`);
    }
})();

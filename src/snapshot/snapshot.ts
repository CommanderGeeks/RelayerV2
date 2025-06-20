require("dotenv").config();
import { connectMongoose } from "../database/connect";
import { logError } from "../helpers/utils";
import { snapshot } from "./index"; 

(async () => {
    try {
        await connectMongoose();
        console.log("Mongodb connected!!!");

        snapshot();
    } catch (error) {
        logError(`Snapshot initialization failed: ${error}`);
    }
})();
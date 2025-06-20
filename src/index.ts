require("dotenv").config();
import chainList from "./config/chains";
import { getWorker, updateWorker } from "./database/wrapper";
import processDeposits from "./process/processDeposits";
import { connectMongoose } from "./database/connect";
import { CRON_SCHEDULE } from "./config";
import processPayouts from "./process/processPayouts";
import validateDeposits from "./process/validateDeposits";
import { logError } from "./helpers/utils";
import processSolDeposit from "./process/solana/processSolDeposit";
import validateSolDeposits from "./process/solana/validateSolDeposits";
import processSolPayouts from "./process/solana/processSolPayouts";
import { SOLANA_CHAIN_ID } from "./config/solana";
const { schedule } = require("node-cron");

const WORKER_ID: number = 1001;

(async () => {
  try {
    await connectMongoose();
    // reset worker
    await updateWorker(WORKER_ID, false);
    for (let index = 0; index < chainList.length; index++) {
      const chain = chainList[index];
      await updateWorker(chain.chainId, false);
    }
    console.log("Mongodb connected!!!");
  } catch (error) {
    logError(`Initialization failed: ${error}`);
  }
})();

schedule(CRON_SCHEDULE, async () => {
  try {
    const worker = await getWorker(WORKER_ID);
    if (worker) return;

    await updateWorker(WORKER_ID, true);

    // Validate Sol Deposits and Process Payouts
    await processSolDeposit(SOLANA_CHAIN_ID);
    await validateSolDeposits(SOLANA_CHAIN_ID);
    await processSolPayouts(SOLANA_CHAIN_ID);


    for (let index = 0; index < chainList.length; index++) {
      const chain = chainList[index];
      // skip solana chain
      if (chain.chainId === SOLANA_CHAIN_ID) continue;

      await processDeposits(chain.chainId);
      await validateDeposits(chain.chainId);
      await processPayouts(chain.chainId);
    }

    await updateWorker(WORKER_ID, false);
  } catch (error) {
    logError(error);
  } finally {
    await updateWorker(WORKER_ID, false);
  }
});
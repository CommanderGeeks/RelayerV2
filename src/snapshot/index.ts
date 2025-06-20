import { createOrUpdateGlobal, updateWorker } from "../database/wrapper";
import { config } from "./config";

const callSnapshot = async (chainId: any) => {
    await updateWorker(chainId, true);

    const chain = config.find((c) => c.chainId === chainId);
    if (!chain) throw new Error("Invalid chain id");
    const snapshotBlock = chain.snapshotBlock;

    await createOrUpdateGlobal(Number(chainId), snapshotBlock);
    await updateWorker(chainId, false);
    console.log(`Snapshot block ${snapshotBlock} for chain ${chainId} created`);
};

export const snapshot = async () => {
    config.forEach(async (chain) => {
        await callSnapshot(chain.chainId);
    });
}